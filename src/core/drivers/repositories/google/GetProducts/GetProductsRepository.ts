import { Injectable } from '@nestjs/common';
import { IGetProductsRepository } from 'src/core/adapters/repositories/google/GetProducts/IGetProductsRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../http/GoogleMerchantHttpClient';

@Injectable()
export class GetProductsRepository implements IGetProductsRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async getProduct(sku: string): Promise<unknown> {
    Logger.info(
      `[GOOGLE MERCHANT] get-product ${JSON.stringify({
        sku,
        productId: this.config.productId(sku)
      })}`
    );

    return this.http.get(`/products/v1/accounts/${this.config.accountId}/products/${this.config.productId(sku)}`);
  }
}
