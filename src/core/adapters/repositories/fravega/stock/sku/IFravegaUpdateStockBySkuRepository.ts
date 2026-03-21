import { FravegaUpdateStock } from 'src/core/entities/fravega/stock/FravegaUpdateStock';

export interface IFravegaUpdateStockBySkuRepository {
  execute(refId: string, stock: FravegaUpdateStock): Promise<FravegaUpdateStock>;
}
