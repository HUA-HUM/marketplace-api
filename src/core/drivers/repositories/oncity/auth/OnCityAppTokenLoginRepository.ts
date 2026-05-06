import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IOnCityAppTokenLoginRepository } from 'src/core/adapters/repositories/oncity/auth/IOnCityAppTokenLoginRepository';

@Injectable()
export class OnCityAppTokenLoginRepository implements IOnCityAppTokenLoginRepository {
  private readonly baseURL = 'http://api.vtexcommercestable.com.br';

  async execute(): Promise<unknown> {
    const account = process.env.ONCITY_ACCOUNT;
    const appKey = process.env.ONCITY_APP_KEY;
    const appToken = process.env.ONCITY_APP_TOKEN;

    if (!account) throw new Error('ONCITY_ACCOUNT is not defined');
    if (!appKey) throw new Error('ONCITY_APP_KEY is not defined');
    if (!appToken) throw new Error('ONCITY_APP_TOKEN is not defined');

    const response = await axios.post(
      `${this.baseURL}/api/vtexid/apptoken/login?an=${account}`,
      {
        appkey: appKey,
        apptoken: appToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const vtexIdclientAutCookie = this.extractVtexIdclientAutCookie(response.headers['set-cookie']);

    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return {
        ...response.data,
        vtexIdclientAutCookie
      };
    }

    return {
      data: response.data,
      vtexIdclientAutCookie
    };
  }

  private extractVtexIdclientAutCookie(setCookieHeader: string[] | string | undefined): string | null {
    const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : setCookieHeader ? [setCookieHeader] : [];

    for (const cookie of cookies) {
      const match = cookie.match(/VtexIdclientAutCookie=([^;]+)/);
      if (match?.[1]) return match[1];
    }

    return null;
  }
}
