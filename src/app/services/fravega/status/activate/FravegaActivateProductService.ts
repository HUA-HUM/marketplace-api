import { Inject, Injectable } from '@nestjs/common';
import { IFravegaActivateProductByIdRepository } from 'src/core/adapters/repositories/fravega/status/activate/refeID/IFravegaActivateProductByIdRepository';
import { IFravegaActivateProductBySkuRepository } from 'src/core/adapters/repositories/fravega/status/activate/sku/IFravegaActivateProductBySkuRepository';

@Injectable()
export class FravegaActivateProductService {
  constructor(
    @Inject('IFravegaActivateProductByIdRepository')
    private readonly activateByIdRepository: IFravegaActivateProductByIdRepository,
    @Inject('IFravegaActivateProductBySkuRepository')
    private readonly activateBySkuRepository: IFravegaActivateProductBySkuRepository
  ) {}

  async byId(id: string): Promise<any> {
    return this.activateByIdRepository.execute(id);
  }

  async bySku(refId: string): Promise<any> {
    return this.activateBySkuRepository.execute(refId);
  }
}
