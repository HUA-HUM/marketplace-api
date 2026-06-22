import { Injectable } from '@nestjs/common';
import { IGetProductsRepository } from 'src/core/adapters/repositories/google/GetProducts/IGetProductsRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../http/GoogleMerchantHttpClient';
import { GoogleMerchantStatusMapper } from '../mapper/GoogleMerchantStatusMapper';

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

    const response = await this.http.get<{
      products?: Record<string, unknown>[];
      nextPageToken?: string;
    }>(`/products/v1/accounts/${this.config.accountId}/products`, {
      pageSize: String(pageSize),
      ...(params.pageToken ? { pageToken: params.pageToken } : {})
    });

    return {
      ...response,
      products: (response.products ?? []).map((product) => this.withMarketplaceStatus(product))
    };
  }

  async getProduct(params: { sku: string; contentLanguage?: string; feedLabel?: string }): Promise<unknown> {
    const productId = this.config.productId(params.sku, {
      contentLanguage: params.contentLanguage,
      feedLabel: params.feedLabel
    });

    Logger.info(
      `[GOOGLE MERCHANT] get-product ${JSON.stringify({
        sku: params.sku,
        productId
      })}`
    );

    const product = await this.http.get<Record<string, unknown>>(
      `/products/v1/accounts/${this.config.accountId}/products/${productId}`
    );

    return this.withMarketplaceStatus(product);
  }

  private withMarketplaceStatus(product: Record<string, unknown>): Record<string, unknown> {
    return GoogleMerchantStatusMapper.appendPublicationStatus(product, {
      targetCountry: this.config.statusCountry,
      targetContexts: this.config.statusContexts
    });
  }
}
