import { Inject, Injectable } from '@nestjs/common';
import { IFravegaUpdateStockByIdRepository } from 'src/core/adapters/repositories/fravega/stock/refeId/IFravegaUpdateStockByIdRepository';
import { IFravegaUpdateStockBySkuRepository } from 'src/core/adapters/repositories/fravega/stock/sku/IFravegaUpdateStockBySkuRepository';
import { FravegaUpdateStock } from 'src/core/entities/fravega/stock/FravegaUpdateStock';

@Injectable()
export class FravegaUpdateStockService {
  constructor(
    @Inject('IFravegaUpdateStockByIdRepository')
    private readonly updateByIdRepository: IFravegaUpdateStockByIdRepository,
    @Inject('IFravegaUpdateStockBySkuRepository')
    private readonly updateBySkuRepository: IFravegaUpdateStockBySkuRepository
  ) {}

  async byId(id: string, stock: FravegaUpdateStock): Promise<FravegaUpdateStock> {
    return this.updateByIdRepository.execute(id, stock);
  }

  async bySku(refId: string, stock: FravegaUpdateStock): Promise<FravegaUpdateStock> {
    return this.updateBySkuRepository.execute(refId, stock);
  }
}
