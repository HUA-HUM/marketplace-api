export class FravegaHttpError extends Error {
  constructor(
    public status: number | null,
    public data: any,
    public type: 'TIMEOUT' | 'RATE_LIMIT' | 'SERVER' | 'UNKNOWN',
    message: string
  ) {
    super(message);
  }
}
