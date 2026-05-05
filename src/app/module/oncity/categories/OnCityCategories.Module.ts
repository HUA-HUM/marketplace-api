import { Module } from '@nestjs/common';
import { GetOnCityTreeCategoriesController } from 'src/app/controller/oncity/categories/GetOnCityTreeCategories.Controller';
import { GetOnCityTreeCategoriesService } from 'src/app/services/oncity/categories/GetOnCityTreeCategoriesService';
import { GetTreeCategoriesReposiotry } from 'src/core/drivers/repositories/oncity/categories/GetTreeCategoriesReposiotry';
import { OnCityHttpClient } from 'src/core/drivers/repositories/oncity/http/OnCityHttpClient';

@Module({
  controllers: [GetOnCityTreeCategoriesController],
  providers: [
    GetOnCityTreeCategoriesService,
    {
      provide: 'IOnCityGetTreeCategoriesRepository',
      useClass: GetTreeCategoriesReposiotry
    },
    OnCityHttpClient
  ],
  exports: [GetOnCityTreeCategoriesService]
})
export class OnCityCategoriesModule {}
