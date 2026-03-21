import { Inject, Injectable } from '@nestjs/common';
import { IFravegaDesactivateProductByIdRepository } from 'src/core/adapters/repositories/fravega/status/desactivate/refeID/IFravegaDesactivateProductByIdRepository';
import { IFravegaDesactivateProductBySkuRepository } from 'src/core/adapters/repositories/fravega/status/desactivate/sku/IFravegaDesactivateProductBySkuRepository';

@Injectable()
export class FravegaDesactivateProductService {
  constructor(
    @Inject('IFravegaDesactivateProductByIdRepository')
    private readonly desactivateByIdRepository: IFravegaDesactivateProductByIdRepository,
    @Inject('IFravegaDesactivateProductBySkuRepository')
    private readonly desactivateBySkuRepository: IFravegaDesactivateProductBySkuRepository
  ) {}

  async byId(id: string): Promise<any> {
    return this.desactivateByIdRepository.execute(id);
  }

  async bySku(refId: string): Promise<any> {
    return this.desactivateBySkuRepository.execute(refId);
  }
}
