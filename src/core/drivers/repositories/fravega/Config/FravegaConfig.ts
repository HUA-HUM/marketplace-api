export class FravegaConfig {
  readonly baseUrl: string;
  readonly sellerId: string;
  readonly apiKey: string;
  readonly apiToken: string;

  constructor() {
    const baseUrl = process.env.FRAVEGA_BASE_URL;
    const sellerId = process.env.FRAVEGA_SELLER_ID;
    const apiKey = process.env.FRAVEGA_API_KEY;
    const apiToken = process.env.FRAVEGA_API_TOKEN;

    if (!baseUrl) throw new Error('FRAVEGA_BASE_URL is not defined');
    if (!sellerId) throw new Error('FRAVEGA_SELLER_ID is not defined');
    if (!apiKey) throw new Error('FRAVEGA_API_KEY is not defined');
    if (!apiToken) throw new Error('FRAVEGA_API_TOKEN is not defined');

    this.baseUrl = baseUrl;
    this.sellerId = sellerId;
    this.apiKey = apiKey;
    this.apiToken = apiToken;
  }
}
