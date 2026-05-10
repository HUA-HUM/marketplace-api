import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  IOnCityImageUploadRepository,
  OnCityImageUploadCommand
} from 'src/core/adapters/repositories/oncity/images/IOnCityImageUploadRepository';
import { IOnCityAppTokenLoginRepository } from 'src/core/adapters/repositories/oncity/auth/IOnCityAppTokenLoginRepository';
import { OnCityHttpError } from '../http/errors/OnCityHttpError';

@Injectable()
export class OnCityImageUploadRepository implements IOnCityImageUploadRepository {
  constructor(
    @Inject('IOnCityAppTokenLoginRepository')
    private readonly appTokenLoginRepository: IOnCityAppTokenLoginRepository
  ) {}

  async execute(command: OnCityImageUploadCommand): Promise<unknown> {
    const account = process.env.ONCITY_ACCOUNT;
    if (!account) throw new Error('ONCITY_ACCOUNT is not defined');

    const loginResponse = await this.appTokenLoginRepository.execute();
    const authCookie = this.extractAuthCookie(loginResponse);

    if (!authCookie) {
      throw new Error('No se pudo obtener VtexIdclientAutCookie desde el login de VTEX');
    }

    const form = new FormData();
    const blob = new Blob([new Uint8Array(command.buffer)], {
      type: command.mimeType || 'application/octet-stream'
    });

    form.append('', blob, command.originalName || command.fileName);

    const url = `https://app.io.vtex.com/vtex.catalog-images/v0/${account}/master/images/save/${encodeURIComponent(
      command.fileName
    )}`;

    try {
      const response = await axios.post(url, form, {
        headers: {
          VtexIdclientAutCookie: authCookie
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? null;
        const type = status && status >= 500 ? 'SERVER' : 'UNKNOWN';

        throw new OnCityHttpError(
          status,
          error.response?.data ?? error.message,
          type,
          `[ONCITY IMAGE UPLOAD] ${url} -> ${status ?? 'NO_STATUS'}`
        );
      }

      throw error;
    }
  }

  private extractAuthCookie(loginResponse: unknown): string | null {
    if (typeof loginResponse === 'string') return loginResponse;

    if (!loginResponse || typeof loginResponse !== 'object') return null;

    const response = loginResponse as Record<string, unknown>;
    const candidateKeys = [
      'vtexIdclientAutCookie',
      'VtexIdclientAutCookie',
      'VtexIdclientAutCookie',
      'token',
      'authToken',
      'cookie'
    ];

    for (const key of candidateKeys) {
      const value = response[key];
      if (typeof value === 'string' && value.length > 0) return value;
    }

    return null;
  }
}
