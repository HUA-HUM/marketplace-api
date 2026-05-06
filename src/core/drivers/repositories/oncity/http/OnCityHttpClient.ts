import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { OnCityHttpError } from './errors/OnCityHttpError';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

@Injectable()
export class OnCityHttpClient {
  private readonly client: AxiosInstance;
  private readonly MAX_RETRIES = 3;

  constructor() {
    const account = process.env.ONCITY_ACCOUNT;
    const appKey = process.env.ONCITY_APP_KEY;
    const appToken = process.env.ONCITY_APP_TOKEN;

    if (!account) throw new Error('ONCITY_ACCOUNT is not defined');
    if (!appKey) throw new Error('ONCITY_APP_KEY is not defined');
    if (!appToken) throw new Error('ONCITY_APP_TOKEN is not defined');

    this.client = axios.create({
      baseURL: `https://${account}.vtexcommercestable.com.br`,
      timeout: 4000,
      headers: {
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
  }

  /* ========================== GET ========================== */
  async get<T>(url: string): Promise<T> {
    return this.requestWithRetry<T>(() => this.client.get<T>(url), 'GET', url);
  }

  /* ========================== POST ========================= */
  async post<T>(url: string, body: any, options?: { baseURL?: string }): Promise<T> {
    return this.requestWithRetry<T>(
      () =>
        this.client.post<T>(url, body, {
          baseURL: options?.baseURL
        }),
      'POST',
      url
    );
  }

  /* ========================== PUT ========================== */
  async put<T>(url: string, body: any, options?: { baseURL?: string }): Promise<T> {
    return this.requestWithRetry<T>(
      () =>
        this.client.put<T>(url, body, {
          baseURL: options?.baseURL
        }),
      'PUT',
      url
    );
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

        /* ⏱ TIMEOUT / CANCEL */
        if (err.code === 'ECONNABORTED') {
          if (attempt < this.MAX_RETRIES) {
            await sleep(attempt * 600);
            continue;
          }

          throw new OnCityHttpError(null, null, 'TIMEOUT', `[ONCITY ${method}] ${url} → TIMEOUT`);
        }

        /* RATE LIMIT / VTEX SATURADO */
        if (status === 429 || status === 500) {
          if (attempt < this.MAX_RETRIES) {
            await sleep(attempt * 1000);
            continue;
          }

          throw new OnCityHttpError(
            status,
            err.response?.data,
            'RATE_LIMIT',
            `[ONCITY ${method}] ${url} → ${status} ${JSON.stringify(err.response?.data)}`
          );
        }

        /* OTROS ERRORES*/
        if (status && status >= 500) {
          throw new OnCityHttpError(status, err.response?.data, 'SERVER', `[ONCITY ${method}] ${url} → ${status}`);
        }

        /*DESCONOCIDO */
        throw new OnCityHttpError(
          status ?? null,
          err.response?.data ?? err.message,
          'UNKNOWN',
          `[ONCITY ${method}] ${url} → ${err.message}`
        );
      }
    }

    // nunca debería llegar acá
    throw new OnCityHttpError(null, null, 'UNKNOWN', `[ONCITY ${method}] ${url} → UNKNOWN`);
  }
}
