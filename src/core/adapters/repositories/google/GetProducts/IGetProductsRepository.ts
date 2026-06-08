export interface IGetProductsRepository {
  getProduct(sku: string): Promise<unknown>;
}
