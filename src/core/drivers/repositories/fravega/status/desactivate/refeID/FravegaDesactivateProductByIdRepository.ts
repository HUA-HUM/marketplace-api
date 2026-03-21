import { Injectable } from '@nestjs/common';
import { IFravegaDesactivateProductByIdRepository } from 'src/core/adapters/repositories/fravega/status/desactivate/refeID/IFravegaDesactivateProductByIdRepository';
import { FravegaHttpClient } from '../../../http/FravegaHttpClient';

@Injectable()
export class FravegaDesactivateProductByIdRepository implements IFravegaDesactivateProductByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string): Promise<any> {
    return this.http.post(`/api/v1/item/${encodeURIComponent(id)}/deactivated`, {});
  }
}
