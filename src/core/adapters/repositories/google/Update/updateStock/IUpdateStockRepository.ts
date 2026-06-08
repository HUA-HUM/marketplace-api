export interface IUpdateStockRepository {
  updateStock(sku: string, stock: number): Promise<unknown>;
}
