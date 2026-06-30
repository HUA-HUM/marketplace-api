export class FravegaVtexHttpError extends Error {
  constructor(
    public statusCode: number | null,
    public data: unknown,
    public type: 'CONFIG' | 'TIMEOUT' | 'RATE_LIMIT' | 'SERVER' | 'UNKNOWN',
    message: string
  ) {
    super(message);
  }
}
