import { Injectable } from '@nestjs/common';
import { FravegaHttpClient } from '../http/FravegaHttpClient';
import { IFravegaGetCategoriesTreeRepository } from 'src/core/adapters/repositories/fravega/categories/IFravegaGetCategoriesTreeRepository';

@Injectable()
export class FravegaGetCategoriesTreeRepository implements IFravegaGetCategoriesTreeRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(): Promise<any> {
    const response = await this.http.get<any>('/api/v1/seller?full=true');

    return response;
  }
}
