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

  async listProducts(params: { pageSize?: number; pageToken?: string }): Promise<{
    products: unknown[];
    nextPageToken?: string;
  }> {
    const pageSize = params.pageSize ? Math.min(params.pageSize, 1000) : 25;

    Logger.info(
      `[GOOGLE MERCHANT] list-products ${JSON.stringify({
        pageSize,
        hasPageToken: Boolean(params.pageToken)
      })}`
    );

    return this.http.get(`/products/v1/accounts/${this.config.accountId}/products`, {
      pageSize: String(pageSize),
      ...(params.pageToken ? { pageToken: params.pageToken } : {})
    });
  }

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
