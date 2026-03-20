import { Injectable } from '@nestjs/common';
import { FravegaPublishProductAdapter } from 'src/core/adapters/repositories/fravega/products/publish/IFravegaPublishProductRepository';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { FravegaPublishProduct } from 'src/core/entities/fravega/products/publish/FravegaProductCreate';
import { FravegaConfig } from '../../Config/FravegaConfig';

@Injectable()
export class FravegaPublishProductRepository implements FravegaPublishProductAdapter {
  private readonly http: FravegaHttpClient;

  constructor() {
    const config = new FravegaConfig('publish');
    this.http = new FravegaHttpClient(config);
  }

  async publish(body: FravegaPublishProduct): Promise<any> {
    try {
      const response = await this.http.post('/api/item', body);

      return {
        status: 200,
        data: response
      };
    } catch (error: any) {
      return {
        status: error.status || 500,
        data: JSON.parse(JSON.stringify(error.data))
      };
    }
  }
}
