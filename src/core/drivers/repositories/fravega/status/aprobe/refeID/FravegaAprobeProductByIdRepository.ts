import { Injectable } from '@nestjs/common';
import { IFravegaAprobeProductByIdRepository } from 'src/core/adapters/repositories/fravega/status/aprobe/refeID/IFravegaAprobeProductByIdRepository';
import { FravegaHttpClient } from '../../../http/FravegaHttpClient';

@Injectable()
export class FravegaAprobeProductByIdRepository implements IFravegaAprobeProductByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string): Promise<any> {
    return this.http.patch(`/api/v1/item/${encodeURIComponent(id)}/request-approval`, {});
  }
}
