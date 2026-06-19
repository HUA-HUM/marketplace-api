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

  async deleteProduct(params: { sku: string; contentLanguage?: string; feedLabel?: string }): Promise<unknown> {
    const productInputId = this.config.productId(params.sku, {
      contentLanguage: params.contentLanguage,
      feedLabel: params.feedLabel
    });
    const product = await this.getProductOrNull(productInputId);

    if (!product) {
      Logger.warn(
        `[GOOGLE MERCHANT] delete-product-not-found ${JSON.stringify({
          sku: params.sku,
          productInputId
        })}`
      );

      return {
        deleted: false,
        sku: params.sku,
        productInputId,
        reason: 'NOT_FOUND',
        message: 'Producto no encontrado en Google Merchant para este SKU / offerId'
      };
    }

    const dataSource = product.dataSource;

    if (!dataSource) {
      throw new GoogleMerchantHttpError(
        null,
        { sku: params.sku, product },
        'UNKNOWN',
        `Google Merchant product ${params.sku} does not include a dataSource`
      );
    }

    Logger.info(
      `[GOOGLE MERCHANT] delete-product ${JSON.stringify({
        sku: params.sku,
        productInputId,
        dataSource
      })}`
    );

    await this.http.delete(`/products/v1/accounts/${this.config.accountId}/productInputs/${productInputId}`, {
      dataSource
    });

    return {
      deleted: true,
      sku: params.sku,
      productInputId,
      dataSource
    };
  }

  private async getProductOrNull(productInputId: string): Promise<GoogleMerchantProductResponse | null> {
    try {
      return await this.http.get<GoogleMerchantProductResponse>(
        `/products/v1/accounts/${this.config.accountId}/products/${productInputId}`
      );
    } catch (error) {
      if (error instanceof GoogleMerchantHttpError && error.status === 404 && this.isItemNotFound(error.data)) {
        return null;
      }

      throw error;
    }
  }

  private isItemNotFound(data: unknown): boolean {
    const error = data as { error?: { details?: Array<{ metadata?: { REASON?: string } }> } };
    return error.error?.details?.some(detail => detail.metadata?.REASON === 'ITEM_NOT_FOUND') ?? false;
  }
}
