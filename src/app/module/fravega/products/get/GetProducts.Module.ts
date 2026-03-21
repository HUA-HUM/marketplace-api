import { Module } from '@nestjs/common';
import { GetFravegaProductsController } from 'src/app/controller/fravega/products/get/GetFravegaProducts.controller';
import { GetFravegaProductsService } from 'src/app/services/fravega/products/get/GetFravegaProductsService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaGetProductsRepository } from 'src/core/drivers/repositories/fravega/products/get/FravegaGetProductsRepository';

@Module({
  controllers: [GetFravegaProductsController],
  providers: [
    GetFravegaProductsService,
    {
      provide: 'IFravegaGetProductsRepository',
      useClass: FravegaGetProductsRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [GetFravegaProductsService]
})
export class GetProductsModule {}
