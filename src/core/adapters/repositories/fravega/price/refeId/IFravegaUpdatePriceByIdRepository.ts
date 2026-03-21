import { FravegaUpdatePrice } from 'src/core/entities/fravega/price/FravegaUpdatePrice';

export interface IFravegaUpdatePriceByIdRepository {
  execute(id: string, price: FravegaUpdatePrice): Promise<any>;
}
