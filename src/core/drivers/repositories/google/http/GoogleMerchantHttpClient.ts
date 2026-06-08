import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { IGoogleMerchantAuthRepository } from 'src/core/adapters/repositories/google/auth/IGoogleMerchantAuthRepository';
import { Logger } from 'src/core/drivers/logger/Logger';
import { GoogleMerchantHttpError } from './errors/GoogleMerchantHttpError';

@Injectable()
export class GoogleMerchantHttpClient {
  private readonly http: AxiosInstance;
  private readonly baseUrl = 'https://merchantapi.googleapis.com';

  constructor(
    @Inject('IGoogleMerchantAuthRepository')
    private readonly authRepository: IGoogleMerchantAuthRepository
  ) {
    this.http = axios.create({
      baseURL: this.baseUrl,
      timeout: 12000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', url, undefined, params);
  }

  async post<T>(url: string, body: unknown, params?: Record<string, string>): Promise<T> {
    return this.request<T>('POST', url, body, params);
  }

  async delete<T>(url: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>('DELETE', url, undefined, params);
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    url: string,
    data?: unknown,
    params?: Record<string, string>
  ): Promise<T> {
    try {
      const token = await this.authRepository.getAccessToken();
      const response = await this.http.request<T>({
        method,
        url,
        data,
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (error instanceof GoogleMerchantHttpError) {
        throw error;
      }

      const err = error as AxiosError;
      const status = err.response?.status ?? null;
      const responseData = err.response?.data ?? err.message;

      Logger.warn(
        `[GOOGLE MERCHANT] request-error ${JSON.stringify({
          method,
          url,
          status,
          response: responseData
        })}`
      );

      throw new GoogleMerchantHttpError(
        status,
        responseData,
        status ? 'GOOGLE_API' : 'UNKNOWN',
        `[GOOGLE MERCHANT ${method}] ${this.baseUrl}${url} -> ${err.message}`
      );
    }
  }
}
