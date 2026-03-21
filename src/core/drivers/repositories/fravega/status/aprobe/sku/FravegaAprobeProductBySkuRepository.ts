import { Injectable } from '@nestjs/common';
import { IFravegaAprobeProductBySkuRepository } from 'src/core/adapters/repositories/fravega/status/aprobe/sku/IFravegaAprobeProductBySkuRepository';
import { FravegaHttpClient } from '../../../http/FravegaHttpClient';

@Injectable()
export class FravegaAprobeProductBySkuRepository implements IFravegaAprobeProductBySkuRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(refId: string): Promise<any> {
    return this.http.patch(`/api/v1/item/refId/${encodeURIComponent(refId)}/request-approval`, {});
  }
}
