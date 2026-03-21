import { Injectable } from '@nestjs/common';
import { IFravegaUpdateItemByIdRepository } from 'src/core/adapters/repositories/fravega/update/Id/IFravegaUpdateItemByIdRepository';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { FravegaUpdateItemRequest } from 'src/core/entities/fravega/update/FravegaUpdateItemRequest';
import { FravegaUpdatedItem } from 'src/core/entities/fravega/update/FravegaUpdatedItem';

@Injectable()
export class FravegaUpdateItemByIdRepository implements IFravegaUpdateItemByIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(id: string, body: FravegaUpdateItemRequest): Promise<FravegaUpdatedItem> {
    return this.http.put(`/api/v1/item/${encodeURIComponent(id)}`, body);
  }
}
