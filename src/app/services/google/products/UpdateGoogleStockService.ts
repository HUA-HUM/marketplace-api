import { Inject, Injectable } from '@nestjs/common';
import { IUpdateStockRepository } from 'src/core/adapters/repositories/google/Update/updateStock/IUpdateStockRepository';

@Injectable()
export class UpdateGoogleStockService {
  constructor(
    @Inject('IUpdateStockRepository')
    private readonly updateStockRepository: IUpdateStockRepository
  ) {}

  execute(sku: string, stock: number): Promise<unknown> {
    return this.updateStockRepository.updateStock(sku, stock);
  }
}
