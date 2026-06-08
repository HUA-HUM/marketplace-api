import { Injectable } from '@nestjs/common';
import { IUpdatePriceRepository } from 'src/core/adapters/repositories/google/Update/UpdatePrice/IUpdatePriceRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../../http/GoogleMerchantHttpClient';
import { GoogleMerchantProductMapper } from '../../mapper/GoogleMerchantProductMapper';

@Injectable()
export class UpdatePriceRepository implements IUpdatePriceRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async updatePrice(sku: string, price: number): Promise<unknown> {
    Logger.info(
      `[GOOGLE MERCHANT] update-price ${JSON.stringify({
        sku,
        price,
        dataSource: this.config.dataSourceName()
      })}`
    );

    return this.http.post(
      `/products/v1/accounts/${this.config.accountId}/productInputs:insert`,
      GoogleMerchantProductMapper.toPartialProductInput(sku, this.config, {
        price: GoogleMerchantProductMapper.toPrice(price, this.config)
      }),
      {
        dataSource: this.config.dataSourceName()
      }
    );
  }
}
