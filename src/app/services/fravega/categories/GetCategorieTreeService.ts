import { Inject, Injectable } from '@nestjs/common';
import { IFravegaGetCategoriesTreeRepository } from 'src/core/adapters/repositories/fravega/categories/IFravegaGetCategoriesTreeRepository';

@Injectable()
export class GetCategorieTreeService {
  constructor(
    @Inject('IFravegaGetCategoriesTreeRepository')
    private readonly categoriesRepository: IFravegaGetCategoriesTreeRepository
  ) {}

  async getCategoriesTree(): Promise<any> {
    return this.categoriesRepository.execute();
  }
}
