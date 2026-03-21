import { Injectable } from '@nestjs/common';
import { IFravegaUpdateStockBySkuRepository } from 'src/core/adapters/repositories/fravega/stock/sku/IFravegaUpdateStockBySkuRepository';
import { FravegaUpdateStock } from 'src/core/entities/fravega/stock/FravegaUpdateStock';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';

@Injectable()
export class FravegaUpdateStockBySkuRepository implements IFravegaUpdateStockBySkuRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(refId: string, stock: FravegaUpdateStock): Promise<FravegaUpdateStock> {
    return this.http.put(`/api/v1/item/stock?refId=${encodeURIComponent(refId)}`, stock);
  }
}
