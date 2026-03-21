import { Injectable } from '@nestjs/common';
import { IFravegaUpdateStockByIdRepository } from 'src/core/adapters/repositories/fravega/stock/refeId/IFravegaUpdateStockByIdRepository';
import { FravegaUpdateStock } from 'src/core/entities/fravega/stock/FravegaUpdateStock';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';

@Injectable()
export class FravegaUpdateStockByIdRepository implements IFravegaUpdateStockByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string, stock: FravegaUpdateStock): Promise<FravegaUpdateStock> {
    return this.http.put(`/api/v1/item/${encodeURIComponent(id)}/stock`, stock);
  }
}
