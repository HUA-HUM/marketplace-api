import { Injectable } from '@nestjs/common';
import { IFravegaGetProductsRepository } from 'src/core/adapters/repositories/fravega/products/get/IFravegaGetProductsRepository';
import { PaginationParams } from 'src/core/entities/common/Pagination';
import { PaginatedResult } from 'src/core/entities/common/PaginatedResult';
import { FravegaProduct } from 'src/core/entities/fravega/products/get/FravegaProduct';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { FravegaProductsApiResponse } from 'src/core/entities/fravega/products/get/FravegaProductsApiResponse';

@Injectable()
export class FravegaGetProductsRepository implements IFravegaGetProductsRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async list(pagination: PaginationParams): Promise<PaginatedResult<FravegaProduct>> {
    const pageSize = pagination.limit;
    const firstPage = Math.floor(pagination.offset / pageSize) + 1;
    const skipInFirstPage = pagination.offset % pageSize;
    const neededItems = skipInFirstPage + pagination.limit;

    const collectedItems: FravegaProduct[] = [];
    let currentPage = firstPage;
    let total = 0;
    let hasMorePages = true;

    while (collectedItems.length < neededItems && hasMorePages) {
      const response = await this.fetchPage(currentPage, pageSize);
      const pageItems = this.extractItems(response);

      if (!total) {
        total = this.extractNumber(response, ['total', 'count', 'totalCount']) ?? pageItems.length;
      }

      collectedItems.push(...pageItems);

      const reportedPageSize = this.extractNumber(response, ['size', 'limit', 'pageSize']) ?? pageSize;
      hasMorePages = pageItems.length === reportedPageSize && collectedItems.length + pagination.offset < total;
      currentPage += 1;
    }

    const items = collectedItems.slice(skipInFirstPage, skipInFirstPage + pagination.limit);
    const nextOffset = pagination.offset + items.length < total ? pagination.offset + items.length : null;

    return {
      items,
      total,
      limit: pagination.limit,
      offset: pagination.offset,
      count: items.length,
      hasNext: nextOffset !== null,
      nextOffset
    };
  }

  private async fetchPage(page: number, size: number): Promise<FravegaProductsApiResponse> {
    const query = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    return this.http.get<FravegaProductsApiResponse>(`/api/v1/item?${query.toString()}`);
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
    keys: Array<'total' | 'count' | 'totalCount' | 'size' | 'limit' | 'pageSize'>
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
