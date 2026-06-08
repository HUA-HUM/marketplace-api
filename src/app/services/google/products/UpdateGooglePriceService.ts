import { Inject, Injectable } from '@nestjs/common';
import { IUpdatePriceRepository } from 'src/core/adapters/repositories/google/Update/UpdatePrice/IUpdatePriceRepository';

@Injectable()
export class UpdateGooglePriceService {
  constructor(
    @Inject('IUpdatePriceRepository')
    private readonly updatePriceRepository: IUpdatePriceRepository
  ) {}

  execute(sku: string, price: number): Promise<unknown> {
    return this.updatePriceRepository.updatePrice(sku, price);
  }
}
