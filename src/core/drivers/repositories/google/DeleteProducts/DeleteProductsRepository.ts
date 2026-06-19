import { Injectable } from '@nestjs/common';
import { IDeleteProductsRepository } from 'src/core/adapters/repositories/google/DeleteProducts/IDeleteProductsRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../http/GoogleMerchantHttpClient';
import { GoogleMerchantHttpError } from '../http/errors/GoogleMerchantHttpError';

interface GoogleMerchantProductResponse {
  name?: string;
  offerId?: string;
  dataSource?: string;
}

@Injectable()
export class DeleteProductsRepository implements IDeleteProductsRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async deleteProduct(sku: string): Promise<unknown> {
    const productInputId = this.config.productId(sku);
    const product = await this.http.get<GoogleMerchantProductResponse>(
      `/products/v1/accounts/${this.config.accountId}/products/${productInputId}`
    );
    const dataSource = product.dataSource;

    if (!dataSource) {
      throw new GoogleMerchantHttpError(
        null,
        { sku, product },
        'UNKNOWN',
        `Google Merchant product ${sku} does not include a dataSource`
      );
    }

    Logger.info(
      `[GOOGLE MERCHANT] delete-product ${JSON.stringify({
        sku,
        productInputId,
        dataSource
      })}`
    );

    await this.http.delete(`/products/v1/accounts/${this.config.accountId}/productInputs/${productInputId}`, {
      dataSource
    });

    return {
      deleted: true,
      sku,
      productInputId,
      dataSource
    };
  }
}
