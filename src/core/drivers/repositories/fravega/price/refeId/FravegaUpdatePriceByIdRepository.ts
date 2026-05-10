import { Injectable } from '@nestjs/common';
import { IFravegaUpdatePriceByIdRepository } from 'src/core/adapters/repositories/fravega/price/refeId/IFravegaUpdatePriceByIdRepository';
import { FravegaUpdatePrice } from 'src/core/entities/fravega/price/FravegaUpdatePrice';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { Logger } from 'src/core/drivers/logger/Logger';

@Injectable()
export class FravegaUpdatePriceByIdRepository implements IFravegaUpdatePriceByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string, price: FravegaUpdatePrice): Promise<any> {
    Logger.info(
      `[FRAVEGA PRICE UPDATE] request ${JSON.stringify({
        mode: 'id',
        id,
        price
      })}`
    );

    return this.http.put(`/api/v1/item/${encodeURIComponent(id)}/price`, price);
  }
}
