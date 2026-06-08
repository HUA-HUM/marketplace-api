export interface IUpdatePriceRepository {
  updatePrice(sku: string, price: number): Promise<unknown>;
}
