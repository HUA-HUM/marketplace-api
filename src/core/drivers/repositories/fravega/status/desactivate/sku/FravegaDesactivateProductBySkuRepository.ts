import { Injectable } from '@nestjs/common';
import { IFravegaDesactivateProductBySkuRepository } from 'src/core/adapters/repositories/fravega/status/desactivate/sku/IFravegaDesactivateProductBySkuRepository';
import { FravegaHttpClient } from '../../../http/FravegaHttpClient';

@Injectable()
export class FravegaDesactivateProductBySkuRepository implements IFravegaDesactivateProductBySkuRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(refId: string): Promise<any> {
    return this.http.post(`/api/v1/item/refId/${encodeURIComponent(refId)}/deactivated`, {});
  }
}
