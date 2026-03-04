import { Module } from '@nestjs/common';
import { GetCategoriesTreeController } from 'src/app/controller/fravega/categories/GetCategoriesTree.Controller';
import { GetBrandsService } from 'src/app/services/fravega/brands/GetBrandsService';
import { GetCategorieTreeService } from 'src/app/services/fravega/categories/GetCategorieTreeService';
import { FravegaGetCategoriesTreeRepository } from 'src/core/drivers/repositories/fravega/categories/FravegaGetCategoriesTreeRepository';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';

@Module({
  controllers: [GetCategoriesTreeController],
  providers: [
    GetCategorieTreeService,
    {
      provide: 'IFravegaGetCategoriesTreeRepository',
      useClass: FravegaGetCategoriesTreeRepository
    },

    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [GetCategorieTreeService]
})
export class GetCategoriesModule {}
