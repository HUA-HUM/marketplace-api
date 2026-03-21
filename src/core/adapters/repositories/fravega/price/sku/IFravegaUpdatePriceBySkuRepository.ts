import { FravegaUpdatePrice } from 'src/core/entities/fravega/price/FravegaUpdatePrice';

export interface IFravegaUpdatePriceBySkuRepository {
  execute(refId: string, price: FravegaUpdatePrice): Promise<any>;
}
