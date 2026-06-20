import { GoogleMerchantAvailability } from 'src/core/entities/google/products/GoogleMerchantAvailability';
import { GoogleMerchantProduct } from 'src/core/entities/google/products/GoogleMerchantProduct';
import { GoogleMerchantConfig } from '../config/GoogleMerchantConfig';

export class GoogleMerchantProductMapper {
  static toProductInput(product: GoogleMerchantProduct, config: GoogleMerchantConfig): Record<string, unknown> {
    const productAttributes = this.withoutEmptyValues({
      title: product.title,
      description: product.description,
      link: product.productUrl,
      imageLink: product.imageUrl,
      additionalImageLinks: product.additionalImageUrls,
      availability: this.toAvailability(product.stock),
      condition: product.condition ?? 'new',
      price: this.toPrice(product.price, config),
      brand: product.brand,
      googleProductCategory: product.googleProductCategory,
      gtins: product.gtins,
      mpn: product.mpn,
      identifierExists: this.toIdentifierExists(product),
      shipping: product.shipping?.map((shipping) => this.toShipping(shipping, config))
    });

    return {
      offerId: product.sku,
      contentLanguage: config.contentLanguage,
      feedLabel: config.feedLabel,
      productAttributes
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

  private static toIdentifierExists(product: GoogleMerchantProduct): boolean | undefined {
    if (product.identifierExists !== undefined) {
      return product.identifierExists;
    }

    if (!product.brand && !product.mpn && !product.gtins?.length) {
      return false;
    }

    return undefined;
  }

  private static toShipping(
    shipping: NonNullable<GoogleMerchantProduct['shipping']>[number],
    config: GoogleMerchantConfig
  ): Record<string, unknown> {
    return this.withoutEmptyValues({
      country: shipping.country,
      service: shipping.service,
      price: shipping.price !== undefined ? this.toPrice(shipping.price, config) : undefined,
      minHandlingTime:
        shipping.minHandlingTime !== undefined ? String(shipping.minHandlingTime) : undefined,
      maxHandlingTime:
        shipping.maxHandlingTime !== undefined ? String(shipping.maxHandlingTime) : undefined,
      minTransitTime:
        shipping.minTransitTime !== undefined ? String(shipping.minTransitTime) : undefined,
      maxTransitTime:
        shipping.maxTransitTime !== undefined ? String(shipping.maxTransitTime) : undefined
    });
  }

  private static withoutEmptyValues(values: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(values).filter(([, value]) => {
        if (value === undefined || value === null || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );
  }
}
