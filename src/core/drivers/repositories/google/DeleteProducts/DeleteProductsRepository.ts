import { Injectable } from '@nestjs/common';
import { IDeleteProductsRepository } from 'src/core/adapters/repositories/google/DeleteProducts/IDeleteProductsRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';
import { GoogleMerchantHttpClient } from '../http/GoogleMerchantHttpClient';

@Injectable()
export class DeleteProductsRepository implements IDeleteProductsRepository {
  constructor(
    private readonly http: GoogleMerchantHttpClient,
    private readonly config: GoogleMerchantConfig
  ) {}

  async deleteProduct(sku: string): Promise<unknown> {
    const productInputId = this.config.productId(sku);

    Logger.info(
      `[GOOGLE MERCHANT] delete-product ${JSON.stringify({
        sku,
        productInputId,
        dataSource: this.config.dataSourceName()
      })}`
    );

    return this.http.delete(`/products/v1/accounts/${this.config.accountId}/productInputs/${productInputId}`, {
      dataSource: this.config.dataSourceName()
    });
  }
}
