import { GoogleMerchantProduct } from 'src/core/entities/google/products/GoogleMerchantProduct';

export interface IPostProductsRepository {
  publishProduct(product: GoogleMerchantProduct): Promise<unknown>;
}
