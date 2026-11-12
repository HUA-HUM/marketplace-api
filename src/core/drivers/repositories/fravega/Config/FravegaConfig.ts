export class FravegaConfig {
  readonly baseUrl: string;
  readonly sellerId: string;
  readonly apiKey: string;
  readonly apiToken: string;

  constructor(mode: 'default' | 'publish' | 'orders' = 'default') {
    const baseUrl =
      mode === 'publish'
        ? process.env.FRAVEGA_PUBLISH_BASE_URL
        : mode === 'orders'
          ? process.env.FRAVEGA_ORDERS_BASE_URL ?? process.env.FRAVEGA_BASE_URL
          : process.env.FRAVEGA_BASE_URL;

    const sellerId =
      mode === 'orders'
        ? process.env.FRAVEGA_ORDERS_SELLER_ID ?? process.env.FRAVEGA_SELLER_ID
        : process.env.FRAVEGA_SELLER_ID;
    const apiKey =
      mode === 'orders'
        ? process.env.FRAVEGA_ORDERS_API_KEY ?? process.env.FRAVEGA_API_KEY
        : process.env.FRAVEGA_API_KEY;
    const apiToken =
      mode === 'orders'
        ? process.env.FRAVEGA_ORDERS_API_TOKEN ?? process.env.FRAVEGA_API_TOKEN
        : process.env.FRAVEGA_API_TOKEN;

    if (!baseUrl) {
      throw new Error(
        mode === 'publish'
          ? 'FRAVEGA_PUBLISH_BASE_URL is not defined'
          : mode === 'orders'
            ? 'FRAVEGA_ORDERS_BASE_URL or FRAVEGA_BASE_URL is not defined'
            : 'FRAVEGA_BASE_URL is not defined'
      );
    }

    if (!sellerId) {
      throw new Error(
        mode === 'orders'
          ? 'FRAVEGA_ORDERS_SELLER_ID or FRAVEGA_SELLER_ID is not defined'
          : 'FRAVEGA_SELLER_ID is not defined'
      );
    }

    if (!apiKey) {
      throw new Error(
        mode === 'orders' ? 'FRAVEGA_ORDERS_API_KEY or FRAVEGA_API_KEY is not defined' : 'FRAVEGA_API_KEY is not defined'
      );
    }

    if (!apiToken) {
      throw new Error(
        mode === 'orders'
          ? 'FRAVEGA_ORDERS_API_TOKEN or FRAVEGA_API_TOKEN is not defined'
          : 'FRAVEGA_API_TOKEN is not defined'
      );
    }

    this.baseUrl = baseUrl;
    this.sellerId = sellerId;
    this.apiKey = apiKey;
    this.apiToken = apiToken;
  }
}
