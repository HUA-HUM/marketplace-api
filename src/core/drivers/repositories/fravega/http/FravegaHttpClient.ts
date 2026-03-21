import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
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

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.get<T>(url, config), 'GET', url);
  }

  /* ========================== POST ========================= */

  async post<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.post<T>(url, body, config), 'POST', url);
  }

  /* ========================== PUT ========================== */

  async put<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.put<T>(url, body, config), 'PUT', url);
  }

  /* ========================== PATCH ========================== */

  async patch<T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.patch<T>(url, body, config), 'PATCH', url);
  }

  /* ===================== CORE RETRY ======================== */

  private async requestWithRetry<T>(
    fn: () => Promise<{ data: T }>,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH',
    url: string
  ): Promise<T> {
    const baseURL = this.client.defaults.baseURL ?? '';

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

          throw new FravegaHttpError(null, null, 'TIMEOUT', `[FRAVEGA ${method}] ${baseURL + url} → TIMEOUT`);
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
            `[FRAVEGA ${method}] ${baseURL + url} → RATE LIMIT`
          );
        }

        /* SERVER */
        if (status && status >= 500) {
          throw new FravegaHttpError(
            status,
            err.response?.data,
            'SERVER',
            `[FRAVEGA ${method}] ${baseURL + url} → ${status}`
          );
        }

        /* UNKNOWN (esto es el que estás viendo ahora) */
        throw new FravegaHttpError(
          status ?? null,
          err.response?.data ?? err.message,
          'UNKNOWN',
          `[FRAVEGA ${method}] ${baseURL + url} → ${err.message}`
        );
      }
    }

    throw new FravegaHttpError(null, null, 'UNKNOWN', `[FRAVEGA ${method}] ${baseURL + url} → UNKNOWN`);
  }
}
