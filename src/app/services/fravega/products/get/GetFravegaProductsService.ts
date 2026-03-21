import { Inject, Injectable } from '@nestjs/common';
import { IFravegaGetProductsRepository } from 'src/core/adapters/repositories/fravega/products/get/IFravegaGetProductsRepository';
import { PaginationParams } from 'src/core/entities/common/Pagination';
import { PaginatedResult } from 'src/core/entities/common/PaginatedResult';
import { FravegaProduct } from 'src/core/entities/fravega/products/get/FravegaProduct';

@Injectable()
export class GetFravegaProductsService {
  constructor(
    @Inject('IFravegaGetProductsRepository')
    private readonly productsRepository: IFravegaGetProductsRepository
  ) {}

  async list(pagination: PaginationParams): Promise<PaginatedResult<FravegaProduct>> {
    return this.productsRepository.list(pagination);
  }
}
