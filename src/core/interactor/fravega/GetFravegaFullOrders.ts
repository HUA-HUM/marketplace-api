import { Inject, Injectable, Logger } from '@nestjs/common';
import { IFravegaGetOrdersRepository } from 'src/core/adapters/repositories/fravega/orders/IFravegaGetOrdersRepository';
import { IFravegaVtexOrdersRepository } from 'src/core/adapters/repositories/fravega/vtex/orders/IFravegaVtexOrdersRepository';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import { FravegaOrderSummary } from 'src/core/entities/fravega/orders/FravegaOrdersPage';
import {
  FravegaFullOrder,
  FravegaFullOrderError,
  FravegaFullOrdersPage
} from 'src/core/entities/fravega/orders/full/FravegaFullOrder';
import { FravegaFullOrderMapper } from 'src/core/entities/fravega/orders/full/mapper/FravegaFullOrderMapper';
import { FravegaVtexOrder } from 'src/core/entities/fravega/vtex/orders/FravegaVtexOrder';

/* En VTEX la suborden de Seller Central se registra como FVG-{suborderId} */
const VTEX_ORDER_PREFIX = 'FVG-';

type BuildResult = { order: FravegaFullOrder } | { error: FravegaFullOrderError; cause: unknown };

@Injectable()
export class GetFravegaFullOrders {
  private readonly CONCURRENCY = 5;
  // Seller Central acepta hasta 100 por pagina; un mismo DNI rara vez tiene mas subordenes
  private readonly SUMMARY_LOOKUP_PAGE_SIZE = 100;
  private readonly logger = new Logger(GetFravegaFullOrders.name);

  constructor(
    @Inject('IFravegaGetOrdersRepository')
    private readonly sellerCentralRepo: IFravegaGetOrdersRepository,
    @Inject('IFravegaVtexOrdersRepository')
    private readonly vtexRepo: IFravegaVtexOrdersRepository
  ) {}

  async list(filters: FravegaOrdersFilters, includeRaw = false): Promise<FravegaFullOrdersPage> {
    /* 1️⃣ Listado de Seller Central (orderId + suborderId) */
    const page = await this.sellerCentralRepo.list(filters);

    /* 2️⃣ Completar cada suborden con su detalle y la orden VTEX */
    const results = await this.processInBatches(page.items, this.CONCURRENCY, item =>
      this.build(item.orderId, item.suborderId, includeRaw, item)
    );

    /* 3️⃣ Separar las que fallaron para no perder la pagina entera */
    const items: FravegaFullOrder[] = [];
    const errors: FravegaFullOrderError[] = [];

    for (const result of results) {
      if ('order' in result) items.push(result.order);
      else errors.push(result.error);
    }

    return {
      currentPage: page.currentPage,
      pages: page.pages,
      pageSize: page.pageSize,
      total: page.total,
      items,
      errors
    };
  }

  async getOne(suborderId: string, orderId: number, includeRaw = false): Promise<FravegaFullOrder> {
    const result = await this.build(orderId, suborderId, includeRaw);

    if ('cause' in result) throw result.cause;

    return result.order;
  }

  /* ================== helpers ================== */

  /**
   * Detalle de Seller Central + orden VTEX. Si el detalle por suborden falla (Seller Central lo
   * devuelve 500 seguido) y VTEX responde, se arma con el listado de Seller Central: queda sin email.
   * `summary` es el item del listado cuando ya se tiene (list); en getOne se busca por DNI.
   */
  private async build(
    orderId: number,
    suborderId: string,
    includeRaw: boolean,
    summary?: FravegaOrderSummary
  ): Promise<BuildResult> {
    const vtexOrderId = `${VTEX_ORDER_PREFIX}${suborderId}`;

    const [detail, vtexOrder] = await Promise.allSettled([
      this.sellerCentralRepo.getOne(suborderId, orderId),
      this.vtexRepo.getOrder(vtexOrderId)
    ]);

    if (vtexOrder.status === 'rejected') {
      if (detail.status === 'rejected') {
        return this.toError(orderId, suborderId, 'seller-central', detail.reason);
      }
      return this.toError(orderId, suborderId, 'vtex', vtexOrder.reason);
    }

    if (detail.status === 'fulfilled') {
      return {
        order: FravegaFullOrderMapper.toEntity({
          orderId,
          vtexOrderId,
          detail: detail.value,
          vtexOrder: vtexOrder.value,
          includeRaw
        })
      };
    }

    const fallbackReason = this.errorMessage(detail.reason);
    const fallbackSummary = summary ?? (await this.findSummary(suborderId, vtexOrder.value));

    if (!fallbackSummary) {
      return this.toError(orderId, suborderId, 'seller-central', detail.reason);
    }

    this.logger.warn(
      `[full-orders fallback] ${suborderId} (orden ${orderId}): detalle de Seller Central fallo (${fallbackReason}); se arma con listado + VTEX, sin email`
    );

    return {
      order: FravegaFullOrderMapper.fromSummary({
        vtexOrderId,
        summary: fallbackSummary,
        vtexOrder: vtexOrder.value,
        fallbackReason,
        includeRaw
      })
    };
  }

  /* Busca la suborden en el listado de Seller Central filtrando por el documento que trae VTEX */
  private async findSummary(suborderId: string, vtexOrder: FravegaVtexOrder): Promise<FravegaOrderSummary | undefined> {
    const profile = vtexOrder.clientProfileData as { document?: unknown } | undefined;
    const docnumber = Number(profile?.document);

    if (!Number.isSafeInteger(docnumber) || docnumber <= 0) {
      return undefined;
    }

    try {
      const page = await this.sellerCentralRepo.list({
        docnumber,
        page: 1,
        pageSize: this.SUMMARY_LOOKUP_PAGE_SIZE
      });
      return page.items.find(item => item.suborderId === suborderId);
    } catch (error) {
      this.logger.warn(
        `[full-orders fallback] ${suborderId}: no se pudo buscar en el listado de Seller Central (${this.errorMessage(error)})`
      );
      return undefined;
    }
  }

  private toError(
    orderId: number,
    suborderId: string,
    source: FravegaFullOrderError['source'],
    cause: unknown
  ): BuildResult {
    return {
      error: {
        orderId,
        suborderId,
        source,
        message: this.errorMessage(cause)
      },
      cause
    };
  }

  private errorMessage(cause: unknown): string {
    return cause instanceof Error ? cause.message : String(cause);
  }

  private async processInBatches<T, R>(items: T[], batchSize: number, handler: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(handler));
      results.push(...batchResults);
    }

    return results;
  }
}
