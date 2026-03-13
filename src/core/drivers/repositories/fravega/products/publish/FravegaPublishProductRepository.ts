import { Injectable } from '@nestjs/common';
import { FravegaPublishProductAdapter } from 'src/core/adapters/repositories/fravega/products/publish/IFravegaPublishProductRepository';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { FravegaPublishProduct } from 'src/core/entities/fravega/products/publish/FravegaProductCreate';

@Injectable()
export class FravegaPublishProductRepository implements FravegaPublishProductAdapter {
  constructor(private readonly http: FravegaHttpClient) {}

  async publish(body: FravegaPublishProduct): Promise<any> {
    return this.http.post('/api/item', body);
  }
}
