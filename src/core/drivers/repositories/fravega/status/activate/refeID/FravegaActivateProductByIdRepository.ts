import { Injectable } from '@nestjs/common';
import { IFravegaActivateProductByIdRepository } from 'src/core/adapters/repositories/fravega/status/activate/refeID/IFravegaActivateProductByIdRepository';
import { FravegaHttpClient } from '../../../http/FravegaHttpClient';

@Injectable()
export class FravegaActivateProductByIdRepository implements IFravegaActivateProductByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string): Promise<any> {
    return this.http.post(`/api/v1/item/${encodeURIComponent(id)}/active`, {});
  }
}
