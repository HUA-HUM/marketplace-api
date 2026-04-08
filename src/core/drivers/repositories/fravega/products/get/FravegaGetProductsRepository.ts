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
    const query = new URLSearchParams({
      limit: pagination.limit.toString(),
      offset: pagination.offset.toString()
    });

    const response = await this.http.get<FravegaProductsApiResponse>(`/api/v1/item?${query.toString()}`);

    const rawItems = this.extractItems(response);
    const total = this.extractNumber(response, ['total', 'count', 'totalCount']) ?? rawItems.length;
    const offset = this.extractOffset(response, pagination.offset, pagination.limit);
    const items = rawItems.slice(0, pagination.limit);
    const count = items.length;
    const nextOffset = offset + count < total ? offset + count : null;

    return {
      items,
      total,
      limit: pagination.limit,
      offset,
      count,
      hasNext: nextOffset !== null,
      nextOffset
    };
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
    keys: Array<'total' | 'count' | 'totalCount' | 'limit' | 'pageSize'>
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

  private extractOffset(response: FravegaProductsApiResponse, fallbackOffset: number, limit: number): number {
    if (Array.isArray(response)) return fallbackOffset;
    if (typeof response.offset === 'number' && Number.isFinite(response.offset)) return response.offset;

    if (typeof response.page === 'number' && Number.isFinite(response.page) && response.page > 0) {
      return (response.page - 1) * limit;
    }

    return fallbackOffset;
  }
}
