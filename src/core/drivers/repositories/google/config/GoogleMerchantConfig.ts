import { GoogleMerchantHttpError } from '../http/errors/GoogleMerchantHttpError';

export class GoogleMerchantConfig {
  get accountId(): string {
    return this.requiredEnv('GOOGLE_MERCHANT_ACCOUNT_ID');
  }

  get dataSourceId(): string {
    return this.requiredEnv('GOOGLE_MERCHANT_DATASOURCE_ID');
  }

  get clientEmail(): string {
    return this.requiredEnv('GOOGLE_MERCHANT_CLIENT_EMAIL');
  }

  get privateKey(): string {
    return this.requiredEnv('GOOGLE_MERCHANT_PRIVATE_KEY').replace(/\\n/g, '\n');
  }

  get contentLanguage(): string {
    return process.env.GOOGLE_MERCHANT_CONTENT_LANGUAGE ?? 'es';
  }

  get feedLabel(): string {
    return process.env.GOOGLE_MERCHANT_FEED_LABEL ?? 'AR';
  }

  get currencyCode(): string {
    return process.env.GOOGLE_MERCHANT_CURRENCY_CODE ?? 'ARS';
  }

  get storeBaseUrl(): string {
    return process.env.GOOGLE_MERCHANT_STORE_BASE_URL ?? 'https://tienda.loquieroaca.com';
  }

  dataSourceName(): string {
    return `accounts/${this.accountId}/dataSources/${this.dataSourceId}`;
  }

  productId(sku: string): string {
    return encodeURIComponent(`${this.contentLanguage}~${this.feedLabel}~${sku}`);
  }

  requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new GoogleMerchantHttpError(null, { missingEnv: name }, 'CONFIG', `${name} is not defined`);
    }

    return value;
  }
}
