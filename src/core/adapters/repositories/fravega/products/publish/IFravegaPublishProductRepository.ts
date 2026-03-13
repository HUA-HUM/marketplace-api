import { FravegaPublishProduct } from 'src/core/entities/fravega/products/publish/FravegaProductCreate';

export interface FravegaPublishProductAdapter {
  publish(body: FravegaPublishProduct): Promise<any>;
}
