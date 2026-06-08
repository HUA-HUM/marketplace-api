export interface IUpdateStatusRepository {
  markOutOfStock(sku: string): Promise<unknown>;
}
