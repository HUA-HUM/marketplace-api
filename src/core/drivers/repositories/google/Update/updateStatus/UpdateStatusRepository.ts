import { Injectable } from '@nestjs/common';
import { IUpdateStatusRepository } from 'src/core/adapters/repositories/google/Update/updateStatus/IUpdateStatusRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../../http/GoogleMerchantHttpClient';
import { GoogleMerchantProductMapper } from '../../mapper/GoogleMerchantProductMapper';

@Injectable()
export class UpdateStatusRepository implements IUpdateStatusRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async markOutOfStock(sku: string): Promise<unknown> {
    Logger.info(
      `[GOOGLE MERCHANT] mark-out-of-stock ${JSON.stringify({
        sku,
        dataSource: this.config.dataSourceName()
      })}`
    );

    return this.http.post(
      `/products/v1/accounts/${this.config.accountId}/productInputs:insert`,
      GoogleMerchantProductMapper.toPartialProductInput(sku, this.config, {
        availability: 'OUT_OF_STOCK'
      }),
      {
        dataSource: this.config.dataSourceName()
      }
    );
  }
}
