import { GoogleMerchantAvailability } from 'src/core/entities/google/products/GoogleMerchantAvailability';
import { GoogleMerchantProduct } from 'src/core/entities/google/products/GoogleMerchantProduct';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';

export class GoogleMerchantProductMapper {
  static toProductInput(product: GoogleMerchantProduct, config: GoogleMerchantConfig): Record<string, unknown> {
    return {
      offerId: product.sku,
      contentLanguage: config.contentLanguage,
      feedLabel: config.feedLabel,
      productAttributes: {
        title: product.title,
        description: product.description,
        link: product.productUrl,
        imageLink: product.imageUrl,
        availability: this.toAvailability(product.stock),
        price: this.toPrice(product.price, config),
        ...(product.brand ? { brand: product.brand } : {})
      }
    };
  }

  static toPartialProductInput(
    sku: string,
    config: GoogleMerchantConfig,
    productAttributes: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      offerId: sku,
      contentLanguage: config.contentLanguage,
      feedLabel: config.feedLabel,
      productAttributes
    };
  }

  static toAvailability(stock: number): GoogleMerchantAvailability {
    return stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
  }

  static toPrice(price: number, config: GoogleMerchantConfig): Record<string, string> {
    return {
      amountMicros: String(Math.round(price * 1_000_000)),
      currencyCode: config.currencyCode
    };
  }
}
