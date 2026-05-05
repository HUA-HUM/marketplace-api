import { Injectable } from '@nestjs/common';
import { IOnCityGetTreeCategoriesRepository } from 'src/core/adapters/repositories/oncity/categories/IOnCityGetTreeCategoriesRepository';
import { OnCityHttpClient } from '../http/OnCityHttpClient';

@Injectable()
export class GetTreeCategoriesReposiotry implements IOnCityGetTreeCategoriesRepository {
  private readonly treeLevel = 645;

  constructor(private readonly http: OnCityHttpClient) {}

  async execute(): Promise<unknown> {
    return this.http.get(`/api/catalog_system/pvt/category/tree/${this.treeLevel}`);
  }
}
