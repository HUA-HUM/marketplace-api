import { Module } from '@nestjs/common';
import { FravegaPublishProductController } from 'src/app/controller/fravega/products/FravegaPublishProduct.controller';
import { FravegaPublishProductService } from 'src/app/services/fravega/products/publish/FravegaPublishProductService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaPublishProductRepository } from 'src/core/drivers/repositories/fravega/products/publish/FravegaPublishProductRepository';

@Module({
  controllers: [FravegaPublishProductController],

  providers: [
    FravegaPublishProductService,

    FravegaHttpClient,
    FravegaConfig,

    {
      provide: FravegaPublishProductService,
      useClass: FravegaPublishProductRepository
    }
  ]
})
export class FravegaPublishProductModule {}
