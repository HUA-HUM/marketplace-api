import { Inject, Injectable } from '@nestjs/common';
import { IUpdateStatusRepository } from 'src/core/adapters/repositories/google/Update/updateStatus/IUpdateStatusRepository';

@Injectable()
export class UpdateGoogleStatusService {
  constructor(
    @Inject('IUpdateStatusRepository')
    private readonly updateStatusRepository: IUpdateStatusRepository
  ) {}

  markOutOfStock(sku: string): Promise<unknown> {
    return this.updateStatusRepository.markOutOfStock(sku);
  }
}
