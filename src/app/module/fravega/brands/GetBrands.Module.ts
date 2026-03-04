import { Module } from '@nestjs/common';
import { GetBrandsController } from 'src/app/controller/fravega/brands/GetBrands.controller';
import { GetBrandsService } from 'src/app/services/fravega/brands/GetBrandsService';
import { FravegaGetBrandsRepository } from 'src/core/drivers/repositories/fravega/brands/FravegaGetBrandsRepository';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';

@Module({
  controllers: [GetBrandsController],
  providers: [
    GetBrandsService,
    {
      provide: 'IFravegaGetBrandsRepository',
      useClass: FravegaGetBrandsRepository
    },

    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [GetBrandsService]
})
export class GetBrandsModule {}
