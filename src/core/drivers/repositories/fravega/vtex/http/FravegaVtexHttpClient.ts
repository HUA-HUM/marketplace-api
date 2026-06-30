import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { FravegaVtexHttpError } from './errors/FravegaVtexHttpError';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class FravegaVtexHttpClient {
  private readonly client: AxiosInstance;
  private readonly maxRetries = 3;

  constructor() {
    const account = this.requiredEnv('FRAVEGA_VTEX_ACCOUNT');
    const appKey = this.requiredEnv('FRAVEGA_VTEX_APP_KEY');
    const appToken = this.requiredEnv('FRAVEGA_VTEX_APP_TOKEN');

    this.client = axios.create({
      baseURL: `https://${account}.vtexcommercestable.com.br`,
      timeout: 8000,
      headers: {
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.get<T>(url, { params }), 'GET', url);
  }

  private async requestWithRetry<T>(
    fn: () => Promise<{ data: T }>,
    method: 'GET',
    url: string
  ): Promise<T> {
    const baseURL = this.client.defaults.baseURL ?? '';

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fn();
        return response.data;
      } catch (error) {
        const err = error as AxiosError;
        const status = err.response?.status;

        if (err.code === 'ECONNABORTED') {
          if (attempt < this.maxRetries) {
            await sleep(attempt * 600);
            continue;
          }

          throw new FravegaVtexHttpError(null, null, 'TIMEOUT', `[FRAVEGA VTEX ${method}] ${baseURL + url} -> TIMEOUT`);
        }

        if (status === 429) {
          if (attempt < this.maxRetries) {
            await sleep(attempt * 1000);
            continue;
          }

          throw new FravegaVtexHttpError(
            status,
            err.response?.data,
            'RATE_LIMIT',
            `[FRAVEGA VTEX ${method}] ${baseURL + url} -> RATE_LIMIT`
          );
        }

        if (status && status >= 500) {
          throw new FravegaVtexHttpError(
            status,
            err.response?.data,
            'SERVER',
            `[FRAVEGA VTEX ${method}] ${baseURL + url} -> ${status}`
          );
        }

        throw new FravegaVtexHttpError(
          status ?? null,
          err.response?.data ?? err.message,
          'UNKNOWN',
          `[FRAVEGA VTEX ${method}] ${baseURL + url} -> ${err.message}`
        );
      }
    }

    throw new FravegaVtexHttpError(null, null, 'UNKNOWN', `[FRAVEGA VTEX ${method}] ${baseURL + url} -> UNKNOWN`);
  }

  private requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new FravegaVtexHttpError(null, { missingEnv: name }, 'CONFIG', `${name} is not defined`);
    }

    return value;
  }
}
