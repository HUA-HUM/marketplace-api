import { GoogleMerchantProductsPage } from 'src/core/entities/google/products/GoogleMerchantProductsPage';

export interface IGetProductsRepository {
  listProducts(params: { pageSize?: number; pageToken?: string }): Promise<GoogleMerchantProductsPage>;
  getProduct(sku: string): Promise<unknown>;
}
