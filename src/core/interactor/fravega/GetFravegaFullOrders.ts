import { Inject, Injectable } from '@nestjs/common';
import { IFravegaGetOrdersRepository } from 'src/core/adapters/repositories/fravega/orders/IFravegaGetOrdersRepository';
import { IFravegaVtexOrdersRepository } from 'src/core/adapters/repositories/fravega/vtex/orders/IFravegaVtexOrdersRepository';
import { FravegaOrdersFilters } from 'src/core/entities/fravega/orders/FravegaOrdersFilters';
import {
  FravegaFullOrder,
  FravegaFullOrderError,
  FravegaFullOrdersPage
} from 'src/core/entities/fravega/orders/full/FravegaFullOrder';
import { FravegaFullOrderMapper } from 'src/core/entities/fravega/orders/full/mapper/FravegaFullOrderMapper';

/* En VTEX la suborden de Seller Central se registra como FVG-{suborderId} */
const VTEX_ORDER_PREFIX = 'FVG-';

type BuildResult = { order: FravegaFullOrder } | { error: FravegaFullOrderError; cause: unknown };

@Injectable()
export class GetFravegaFullOrders {
  private readonly CONCURRENCY = 5;

  constructor(
    @Inject('IFravegaGetOrdersRepository')
    private readonly sellerCentralRepo: IFravegaGetOrdersRepository,
    @Inject('IFravegaVtexOrdersRepository')
    private readonly vtexRepo: IFravegaVtexOrdersRepository
  ) {}

  async list(filters: FravegaOrdersFilters): Promise<FravegaFullOrdersPage> {
    /* 1️⃣ Listado de Seller Central (orderId + suborderId) */
    const page = await this.sellerCentralRepo.list(filters);

    /* 2️⃣ Completar cada suborden con su detalle y la orden VTEX */
    const results = await this.processInBatches(page.items, this.CONCURRENCY, item =>
      this.build(item.orderId, item.suborderId)
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

  async getOne(suborderId: string, orderId: number): Promise<FravegaFullOrder> {
    const result = await this.build(orderId, suborderId);

    if ('cause' in result) throw result.cause;

    return result.order;
  }

  /* ================== helpers ================== */

  private async build(orderId: number, suborderId: string): Promise<BuildResult> {
    const vtexOrderId = `${VTEX_ORDER_PREFIX}${suborderId}`;

    const [detail, vtexOrder] = await Promise.allSettled([
      this.sellerCentralRepo.getOne(suborderId, orderId),
      this.vtexRepo.getOrder(vtexOrderId)
    ]);

    if (detail.status === 'rejected') {
      return this.toError(orderId, suborderId, 'seller-central', detail.reason);
    }

    if (vtexOrder.status === 'rejected') {
      return this.toError(orderId, suborderId, 'vtex', vtexOrder.reason);
    }

    return {
      order: FravegaFullOrderMapper.toEntity({
        orderId,
        vtexOrderId,
        detail: detail.value,
        vtexOrder: vtexOrder.value
      })
    };
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
        message: cause instanceof Error ? cause.message : String(cause)
      },
      cause
    };
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
