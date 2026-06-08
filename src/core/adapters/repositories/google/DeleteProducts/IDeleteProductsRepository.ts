export interface IDeleteProductsRepository {
  deleteProduct(sku: string): Promise<unknown>;
}
