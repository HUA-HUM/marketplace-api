import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { IGoogleMerchantAuthRepository } from 'src/core/adapters/repositories/google/auth/IGoogleMerchantAuthRepository';
import { GoogleMerchantConfig } from 'src/core/drivers/repositories/google/config/GoogleMerchantConfig';
import { GoogleMerchantHttpError } from 'src/core/drivers/repositories/google/http/errors/GoogleMerchantHttpError';

@Injectable()
export class GoogleMerchantAuthRepository implements IGoogleMerchantAuthRepository {
  private readonly scope = 'https://www.googleapis.com/auth/content';

  constructor(private readonly config: GoogleMerchantConfig) {}

  async getAccessToken(): Promise<string> {
    try {
      const auth = new GoogleAuth({
        credentials: {
          client_email: this.config.clientEmail,
          private_key: this.config.privateKey
        },
        scopes: [this.scope]
      });

      const client = await auth.getClient();
      const token = await client.getAccessToken();

      if (!token.token) {
        throw new Error('Google auth returned an empty access token');
      }

      return token.token;
    } catch (error) {
      throw new GoogleMerchantHttpError(
        null,
        (error as Error).message,
        'CONFIG',
        `[GOOGLE MERCHANT AUTH] ${(error as Error).message}`
      );
    }
  }
}
