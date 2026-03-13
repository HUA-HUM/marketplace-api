import { Injectable } from '@nestjs/common';
import { FravegaPublishProductAdapter } from 'src/core/adapters/repositories/fravega/products/publish/IFravegaPublishProductRepository';
import { FravegaPublishProduct } from 'src/core/entities/fravega/products/publish/FravegaProductCreate';

@Injectable()
export class FravegaPublishProductService {
  constructor(private readonly repository: FravegaPublishProductAdapter) {}

  async publish(body: FravegaPublishProduct): Promise<any> {
    return this.repository.publish(body);
  }
}
