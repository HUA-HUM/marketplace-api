import { Module } from '@nestjs/common';
import { FravegaDesactivateProductController } from 'src/app/controller/fravega/status/desactivate/FravegaDesactivateProduct.controller';
import { FravegaDesactivateProductService } from 'src/app/services/fravega/status/desactivate/FravegaDesactivateProductService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaDesactivateProductByIdRepository } from 'src/core/drivers/repositories/fravega/status/desactivate/refeID/FravegaDesactivateProductByIdRepository';
import { FravegaDesactivateProductBySkuRepository } from 'src/core/drivers/repositories/fravega/status/desactivate/sku/FravegaDesactivateProductBySkuRepository';

@Module({
  controllers: [FravegaDesactivateProductController],
  providers: [
    FravegaDesactivateProductService,
    {
      provide: 'IFravegaDesactivateProductByIdRepository',
      useClass: FravegaDesactivateProductByIdRepository
    },
    {
      provide: 'IFravegaDesactivateProductBySkuRepository',
      useClass: FravegaDesactivateProductBySkuRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaDesactivateProductService]
})
export class FravegaDesactivateProductModule {}
