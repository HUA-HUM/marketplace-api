import { Injectable } from '@nestjs/common';
import { IPostProductsRepository } from 'src/core/adapters/repositories/google/PostProducts/IPostProductsRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantProduct } from 'src/core/entities/google/products/GoogleMerchantProduct';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../http/GoogleMerchantHttpClient';
import { GoogleMerchantProductMapper } from '../mapper/GoogleMerchantProductMapper';

@Injectable()
export class PostProductsRepository implements IPostProductsRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async publishProduct(product: GoogleMerchantProduct): Promise<unknown> {
    Logger.info(
      `[GOOGLE MERCHANT] publish-product ${JSON.stringify({
        sku: product.sku,
        dataSource: this.config.dataSourceName()
      })}`
    );

    return this.http.post(
      `/products/v1/accounts/${this.config.accountId}/productInputs:insert`,
      GoogleMerchantProductMapper.toProductInput(product, this.config),
      {
        dataSource: this.config.dataSourceName()
      }
    );
  }
}
