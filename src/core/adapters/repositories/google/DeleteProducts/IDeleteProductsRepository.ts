export interface IDeleteProductsRepository {
  deleteProduct(params: { sku: string; contentLanguage?: string; feedLabel?: string }): Promise<unknown>;
}
