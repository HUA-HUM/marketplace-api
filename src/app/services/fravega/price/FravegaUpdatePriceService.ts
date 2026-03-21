import { Inject, Injectable } from '@nestjs/common';
import { IFravegaUpdatePriceByIdRepository } from 'src/core/adapters/repositories/fravega/price/refeId/IFravegaUpdatePriceByIdRepository';
import { IFravegaUpdatePriceBySkuRepository } from 'src/core/adapters/repositories/fravega/price/sku/IFravegaUpdatePriceBySkuRepository';
import { FravegaUpdatePrice } from 'src/core/entities/fravega/price/FravegaUpdatePrice';

@Injectable()
export class FravegaUpdatePriceService {
  constructor(
    @Inject('IFravegaUpdatePriceByIdRepository')
    private readonly updateByIdRepository: IFravegaUpdatePriceByIdRepository,
    @Inject('IFravegaUpdatePriceBySkuRepository')
    private readonly updateBySkuRepository: IFravegaUpdatePriceBySkuRepository
  ) {}

  async byId(id: string, price: FravegaUpdatePrice): Promise<any> {
    return this.updateByIdRepository.execute(id, price);
  }

  async bySku(refId: string, price: FravegaUpdatePrice): Promise<any> {
    return this.updateBySkuRepository.execute(refId, price);
  }
}
