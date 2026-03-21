import { Injectable } from '@nestjs/common';
import { IFravegaUpdatePriceBySkuRepository } from 'src/core/adapters/repositories/fravega/price/sku/IFravegaUpdatePriceBySkuRepository';
import { FravegaUpdatePrice } from 'src/core/entities/fravega/price/FravegaUpdatePrice';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';

@Injectable()
export class FravegaUpdatePriceBySkuRepository implements IFravegaUpdatePriceBySkuRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(refId: string, price: FravegaUpdatePrice): Promise<any> {
    return this.http.put(`/api/v1/item/price?refId=${encodeURIComponent(refId)}`, price);
  }
}
