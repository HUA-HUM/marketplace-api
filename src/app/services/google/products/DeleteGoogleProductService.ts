import { Inject, Injectable } from '@nestjs/common';
import { IDeleteProductsRepository } from 'src/core/adapters/repositories/google/DeleteProducts/IDeleteProductsRepository';

@Injectable()
export class DeleteGoogleProductService {
  constructor(
    @Inject('IDeleteProductsRepository')
    private readonly deleteProductsRepository: IDeleteProductsRepository
  ) {}

  execute(sku: string): Promise<unknown> {
    return this.deleteProductsRepository.deleteProduct(sku);
  }
}
