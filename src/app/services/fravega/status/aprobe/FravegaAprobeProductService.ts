import { Inject, Injectable } from '@nestjs/common';
import { IFravegaAprobeProductByIdRepository } from 'src/core/adapters/repositories/fravega/status/aprobe/refeID/IFravegaAprobeProductByIdRepository';
import { IFravegaAprobeProductBySkuRepository } from 'src/core/adapters/repositories/fravega/status/aprobe/sku/IFravegaAprobeProductBySkuRepository';

@Injectable()
export class FravegaAprobeProductService {
  constructor(
    @Inject('IFravegaAprobeProductByIdRepository')
    private readonly aprobeByIdRepository: IFravegaAprobeProductByIdRepository,
    @Inject('IFravegaAprobeProductBySkuRepository')
    private readonly aprobeBySkuRepository: IFravegaAprobeProductBySkuRepository
  ) {}

  async byId(id: string): Promise<any> {
    return this.aprobeByIdRepository.execute(id);
  }

  async bySku(refId: string): Promise<any> {
    return this.aprobeBySkuRepository.execute(refId);
  }
}
