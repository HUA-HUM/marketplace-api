import { Inject, Injectable } from '@nestjs/common';
import { IOnCityGetTreeCategoriesRepository } from 'src/core/adapters/repositories/oncity/categories/IOnCityGetTreeCategoriesRepository';

@Injectable()
export class GetOnCityTreeCategoriesService {
  constructor(
    @Inject('IOnCityGetTreeCategoriesRepository')
    private readonly repository: IOnCityGetTreeCategoriesRepository
  ) {}

  async execute(): Promise<unknown> {
    return this.repository.execute();
  }
}
