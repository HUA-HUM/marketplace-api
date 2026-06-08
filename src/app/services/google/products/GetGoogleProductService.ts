import { Inject, Injectable } from '@nestjs/common';
import { IGetProductsRepository } from 'src/core/adapters/repositories/google/GetProducts/IGetProductsRepository';
import { GoogleMerchantProductsPage } from 'src/core/entities/google/products/GoogleMerchantProductsPage';

@Injectable()
export class GetGoogleProductService {
  constructor(
    @Inject('IGetProductsRepository')
    private readonly getProductsRepository: IGetProductsRepository
  ) {}

  list(params: { pageSize?: number; pageToken?: string }): Promise<GoogleMerchantProductsPage> {
    return this.getProductsRepository.listProducts(params);
  }

  execute(sku: string): Promise<unknown> {
    return this.getProductsRepository.getProduct(sku);
  }
}
