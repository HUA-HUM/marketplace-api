import { Inject, Injectable } from '@nestjs/common';
import { IPostProductsRepository } from 'src/core/adapters/repositories/google/PostProducts/IPostProductsRepository';
import { GoogleMerchantProduct } from 'src/core/entities/google/products/GoogleMerchantProduct';

@Injectable()
export class PublishGoogleProductService {
  constructor(
    @Inject('IPostProductsRepository')
    private readonly postProductsRepository: IPostProductsRepository
  ) {}

  execute(product: GoogleMerchantProduct): Promise<unknown> {
    return this.postProductsRepository.publishProduct(product);
  }
}
