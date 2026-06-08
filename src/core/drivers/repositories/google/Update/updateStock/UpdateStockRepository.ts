import { Injectable } from '@nestjs/common';
import { IUpdateStockRepository } from 'src/core/adapters/repositories/google/Update/updateStock/IUpdateStockRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../../http/GoogleMerchantHttpClient';
import { GoogleMerchantProductMapper } from '../../mapper/GoogleMerchantProductMapper';

@Injectable()
export class UpdateStockRepository implements IUpdateStockRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async updateStock(sku: string, stock: number): Promise<unknown> {
    Logger.info(
      `[GOOGLE MERCHANT] update-stock ${JSON.stringify({
        sku,
        stock,
        dataSource: this.config.dataSourceName()
      })}`
    );

    return this.http.post(
      `/products/v1/accounts/${this.config.accountId}/productInputs:insert`,
      GoogleMerchantProductMapper.toPartialProductInput(sku, this.config, {
        availability: GoogleMerchantProductMapper.toAvailability(stock)
      }),
      {
        dataSource: this.config.dataSourceName()
      }
    );
  }
}
