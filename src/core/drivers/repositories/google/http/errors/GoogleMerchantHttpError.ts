export class GoogleMerchantHttpError extends Error {
  constructor(
    public status: number | null,
    public data: unknown,
    public type: 'CONFIG' | 'GOOGLE_API' | 'UNKNOWN',
    message: string
  ) {
    super(message);
  }
}
