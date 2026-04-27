import { MegatoneGetProductsResponseDto } from 'src/core/entities/megatone/products/get/dto/MegatoneProductsResponseDto';
import { MarketplaceProduct } from 'src/core/entities/megatone/products/get/MarketplaceProduct';
import { MegatoneProductMapper } from './mappers/MegatoneProductMapper';
import { PaginationParams } from 'src/core/entities/common/Pagination';
import { MarketplacePublicationId } from 'src/core/entities/megatone/products/get/MarketplacePublicationId';
import { PaginatedResult } from 'src/core/entities/common/PaginatedResult';
import { IMegatoneGetProductsRepository } from 'src/core/adapters/repositories/megatone/products/get/IMegatoneGetProductsRepository';
import { MegatoneSellerContext } from '../../sellerContext/MegatoneSellerContext';
import { MegatoneHttpClient } from '../../http/MegatoneHttpClient';
import { Injectable } from '@nestjs/common';
import { MegatoneProductDto } from 'src/core/entities/megatone/products/get/dto/MegatoneProductDto';

@Injectable()
export class MegatoneProductsRepository implements IMegatoneGetProductsRepository {
  private readonly upstreamPageSize = 10;
  private readonly sellerId = MegatoneSellerContext.getSellerId();

  constructor(private readonly http: MegatoneHttpClient) {}

  /* ======================================
     LIST ALL
  ====================================== */
  async listAll(pagination: PaginationParams): Promise<PaginatedResult<MarketplaceProduct>> {
    return this.listSlice(pagination, item => MegatoneProductMapper.toEntity(item));
  }


  /* ======================================
     LIST IDS
  ====================================== */
  async listIds(pagination: PaginationParams): Promise<PaginatedResult<MarketplacePublicationId>> {
    return this.listSlice(pagination, item => ({
        publicationId: item.IdPublicacion,
        sellerSku: item.SkuSeller
      }));
  }

  /* ======================================
     GET ONE
  ====================================== */
  async getOne(publicationId: number): Promise<MarketplaceProduct | null> {
    const response = await this.http.get<MegatoneGetProductsResponseDto>('/api/MarketplaceCore/Publicaciones', {
      params: {
        IdSeller: this.sellerId,
        IdPublicacion: publicationId,
        Pagina: 1,
        Cantidad: 1
      }
    });

    const item = this.getContent(response)[0];
    if (!item) return null;

    return MegatoneProductMapper.toEntity(item);
  }

  private async listSlice<T>(
    pagination: PaginationParams,
    mapItem: (item: MegatoneProductDto) => T
  ): Promise<PaginatedResult<T>> {
    const logicalPage = Math.floor(pagination.offset / this.upstreamPageSize) + 1;
    const skip = pagination.offset % this.upstreamPageSize;
    const needed = skip + pagination.limit;

    const collected: T[] = [];
    let total = 0;
    let currentLogicalPage = logicalPage;

    while (collected.length < needed) {
      const response = await this.fetchLogicalPage(currentLogicalPage);
      const content = this.getContent(response);

      if (total === 0) {
        total = response.Total;
      }

      if (content.length === 0) {
        break;
      }

      collected.push(...content.map(mapItem));

      const logicalOffset = (currentLogicalPage - 1) * this.upstreamPageSize;
      if (logicalOffset + content.length >= total) {
        break;
      }

      currentLogicalPage += 1;
    }

    const items = collected.slice(skip, skip + pagination.limit);
    const count = items.length;
    const nextOffset = pagination.offset + count < total ? pagination.offset + count : null;

    return {
      items,
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      count,
      hasNext: nextOffset !== null,
      nextOffset
    };
  }

  private async fetchLogicalPage(logicalPage: number): Promise<MegatoneGetProductsResponseDto> {
    const physicalPage = this.toPhysicalPage(logicalPage);

    return this.http.get<MegatoneGetProductsResponseDto>('/api/MarketplaceCore/Publicaciones', {
      params: {
        IdSeller: this.sellerId,
        Pagina: physicalPage,
        Cantidad: this.upstreamPageSize
      }
    });
  }

  private toPhysicalPage(logicalPage: number): number {
    return logicalPage <= 1 ? 1 : logicalPage + 1;
  }

  private getContent(response: MegatoneGetProductsResponseDto): MegatoneProductDto[] {
    return Array.isArray(response.Content) ? response.Content : [];
  }
}
