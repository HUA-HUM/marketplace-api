import { Injectable } from '@nestjs/common';
import { IFravegaUpdateItemByRefIdRepository } from 'src/core/adapters/repositories/fravega/update/refeId/IFravegaUpdateItemByRefIdRepository';
import { FravegaHttpClient } from '../../http/FravegaHttpClient';
import { FravegaUpdateItemRequest } from 'src/core/entities/fravega/update/FravegaUpdateItemRequest';
import { FravegaUpdatedItem } from 'src/core/entities/fravega/update/FravegaUpdatedItem';

@Injectable()
export class FravegaUpdateItemByRefIdRepository implements IFravegaUpdateItemByRefIdRepository {
  constructor(private readonly http: FravegaHttpClient) {}

  async execute(refId: string, body: FravegaUpdateItemRequest): Promise<FravegaUpdatedItem> {
    return this.http.put(`/api/v1/item/refId/${encodeURIComponent(refId)}`, body);
  }
}
