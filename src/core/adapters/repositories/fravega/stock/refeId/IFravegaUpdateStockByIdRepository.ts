import { FravegaUpdateStock } from 'src/core/entities/fravega/stock/FravegaUpdateStock';

export interface IFravegaUpdateStockByIdRepository {
  execute(id: string, stock: FravegaUpdateStock): Promise<FravegaUpdateStock>;
}
