import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { FravegaConfig } from '../Config/FravegaConfig';
import { FravegaHttpError } from './error/FravegaHttpError';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

@Injectable()
export class FravegaHttpClient {
  private readonly client: AxiosInstance;
  private readonly MAX_RETRIES = 3;

  constructor(private readonly config: FravegaConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 6000,
      headers: {
        'seller-id': config.sellerId,
        'x-fvg-api-key': config.apiKey,
        'x-fvg-api-token': config.apiToken,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  /* ========================== GET ========================== */

  async get<T>(url: string): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.get<T>(url), 'GET', url);
  }

  /* ========================== POST ========================= */

  async post<T>(url: string, body: any): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.post<T>(url, body), 'POST', url);
  }

  /* ========================== PUT ========================== */

  async put<T>(url: string, body: any): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.put<T>(url, body), 'PUT', url);
  }

  /* ===================== CORE RETRY ======================== */

  private async requestWithRetry<T>(
    fn: () => Promise<{ data: T }>,
    method: 'GET' | 'POST' | 'PUT',
    url: string
  ): Promise<T> {
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await fn();
        return response.data;
      } catch (error) {
        const err = error as AxiosError;
        const status = err.response?.status;

        /* TIMEOUT */
        if (err.code === 'ECONNABORTED') {
          if (attempt < this.MAX_RETRIES) {
            await sleep(attempt * 600);
            continue;
          }

          throw new FravegaHttpError(null, null, 'TIMEOUT', `[FRAVEGA ${method}] ${url} → TIMEOUT`);
        }

        /* RATE LIMIT */
        if (status === 429) {
          if (attempt < this.MAX_RETRIES) {
            await sleep(attempt * 1000);
            continue;
          }

          throw new FravegaHttpError(
            status,
            err.response?.data,
            'RATE_LIMIT',
            `[FRAVEGA ${method}] ${url} → RATE LIMIT`
          );
        }

        /* SERVER */
        if (status && status >= 500) {
          throw new FravegaHttpError(status, err.response?.data, 'SERVER', `[FRAVEGA ${method}] ${url} → ${status}`);
        }

        throw new FravegaHttpError(
          status ?? null,
          err.response?.data ?? err.message,
          'UNKNOWN',
          `[FRAVEGA ${method}] ${url} → ${err.message}`
        );
      }
    }

    throw new FravegaHttpError(null, null, 'UNKNOWN', `[FRAVEGA ${method}] ${url} → UNKNOWN`);
  }
}
