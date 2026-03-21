import { Injectable } from '@nestjs/common';
import { IFravegaActivateProductBySkuRepository } from 'src/core/adapters/repositories/fravega/status/activate/sku/IFravegaActivateProductBySkuRepository';
import { FravegaHttpClient } from '../../../http/FravegaHttpClient';

@Injectable()
export class FravegaActivateProductBySkuRepository implements IFravegaActivateProductBySkuRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(refId: string): Promise<any> {
    return this.http.post(`/api/v1/item/refId/${encodeURIComponent(refId)}/active`, {});
  }
}
