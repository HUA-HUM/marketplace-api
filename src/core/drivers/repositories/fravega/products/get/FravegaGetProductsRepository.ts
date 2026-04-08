import { Injectable } from '@nestjs/common';
import { IFravegaGetProductsRepository } from 'src/core/adapters/repositories/fravega/products/get/IFravegaGetProductsRepository';
import { PaginationParams } from 'src/core/entities/common/Pagination';
import { PaginatedResult } from 'src/core/entities/common/PaginatedResult';
import { FravegaProduct } from 'src/core/entities/fravega/products/get/FravegaProduct';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { FravegaProductsApiResponse } from 'src/core/entities/fravega/products/get/FravegaProductsApiResponse';

@Injectable()
export class FravegaGetProductsRepository implements IFravegaGetProductsRepository {
  private readonly DEFAULT_UPSTREAM_PAGE_SIZE = 100;

  constructor(private readonly http: FravegaHttpClient) {}

  async list(pagination: PaginationParams): Promise<PaginatedResult<FravegaProduct>> {
    const firstPage = Math.floor(pagination.offset / this.DEFAULT_UPSTREAM_PAGE_SIZE) + 1;
    const skip = pagination.offset % this.DEFAULT_UPSTREAM_PAGE_SIZE;
    const requestedCount = skip + pagination.limit;

    let currentPage = firstPage;
    let total: number | null = null;
    const collected: FravegaProduct[] = [];
    let upstreamPageSize = this.DEFAULT_UPSTREAM_PAGE_SIZE;

    while (collected.length < requestedCount) {
      const response = await this.fetchPage(currentPage);
      const pageItems = this.extractItems(response);

      if (total === null) {
        total = this.extractNumber(response, ['total', 'count', 'totalCount']) ?? pageItems.length;
      }

      const reportedPageSize = this.extractNumber(response, ['size', 'limit', 'pageSize']);
      if (reportedPageSize && reportedPageSize > 0) {
        upstreamPageSize = reportedPageSize;
      }

      collected.push(...pageItems);

      const currentOffset = (currentPage - 1) * upstreamPageSize;
      const reachedEnd = pageItems.length === 0 || currentOffset + pageItems.length >= total;

      if (reachedEnd) {
        break;
      }

      currentPage += 1;
    }

    const items = collected.slice(skip, skip + pagination.limit);
    const count = items.length;
    const totalItems = total ?? items.length;
    const nextOffset = pagination.offset + count < totalItems ? pagination.offset + count : null;

    return {
      items,
      total: totalItems,
      limit: pagination.limit,
      offset: pagination.offset,
      count,
      hasNext: nextOffset !== null,
      nextOffset
    };
  }

  private async fetchPage(page: number): Promise<FravegaProductsApiResponse> {
    return this.http.get<FravegaProductsApiResponse>(`/api/v1/item?page=${page}`);
  }

  private extractItems(response: FravegaProductsApiResponse): FravegaProduct[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.items)) return response.items;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.results)) return response.results;

    return [];
  }

  private extractNumber(
    response: FravegaProductsApiResponse,
    keys: Array<'size' | 'total' | 'count' | 'totalCount' | 'limit' | 'pageSize'>
  ): number | null {
    if (Array.isArray(response)) return null;

    for (const key of keys) {
      const value = response[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
    }

    return null;
  }
}
