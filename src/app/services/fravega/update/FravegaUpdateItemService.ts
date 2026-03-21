import { Inject, Injectable } from '@nestjs/common';
import { IFravegaUpdateItemByIdRepository } from 'src/core/adapters/repositories/fravega/update/Id/IFravegaUpdateItemByIdRepository';
import { IFravegaUpdateItemByRefIdRepository } from 'src/core/adapters/repositories/fravega/update/refeId/IFravegaUpdateItemByRefIdRepository';
import { FravegaUpdateItemRequest } from 'src/core/entities/fravega/update/FravegaUpdateItemRequest';
import { FravegaUpdatedItem } from 'src/core/entities/fravega/update/FravegaUpdatedItem';

@Injectable()
export class FravegaUpdateItemService {
  constructor(
    @Inject('IFravegaUpdateItemByIdRepository')
    private readonly updateByIdRepository: IFravegaUpdateItemByIdRepository,
    @Inject('IFravegaUpdateItemByRefIdRepository')
    private readonly updateByRefIdRepository: IFravegaUpdateItemByRefIdRepository
  ) {}

  async byId(id: string, body: FravegaUpdateItemRequest): Promise<FravegaUpdatedItem> {
    return this.updateByIdRepository.execute(id, body);
  }

  async byRefId(refId: string, body: FravegaUpdateItemRequest): Promise<FravegaUpdatedItem> {
    return this.updateByRefIdRepository.execute(refId, body);
  }
}
