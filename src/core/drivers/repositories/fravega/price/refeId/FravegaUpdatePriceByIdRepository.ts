import { Injectable } from '@nestjs/common';
import { IFravegaUpdatePriceByIdRepository } from 'src/core/adapters/repositories/fravega/price/refeId/IFravegaUpdatePriceByIdRepository';
import { FravegaUpdatePrice } from 'src/core/entities/fravega/price/FravegaUpdatePrice';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';

@Injectable()
export class FravegaUpdatePriceByIdRepository implements IFravegaUpdatePriceByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string, price: FravegaUpdatePrice): Promise<any> {
    return this.http.put(`/api/v1/item/${encodeURIComponent(id)}/price`, price);
  }
}
