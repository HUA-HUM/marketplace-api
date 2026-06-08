import { Inject, Injectable } from '@nestjs/common';
import { IGetProductsRepository } from 'src/core/adapters/repositories/google/GetProducts/IGetProductsRepository';

@Injectable()
export class GetGoogleProductService {
  constructor(
    @Inject('IGetProductsRepository')
    private readonly getProductsRepository: IGetProductsRepository
  ) {}

  execute(sku: string): Promise<unknown> {
    return this.getProductsRepository.getProduct(sku);
  }
}
