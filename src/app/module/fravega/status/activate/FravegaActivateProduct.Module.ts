import { Module } from '@nestjs/common';
import { FravegaActivateProductController } from 'src/app/controller/fravega/status/activate/FravegaActivateProduct.controller';
import { FravegaActivateProductService } from 'src/app/services/fravega/status/activate/FravegaActivateProductService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaActivateProductByIdRepository } from 'src/core/drivers/repositories/fravega/status/activate/refeID/FravegaActivateProductByIdRepository';
import { FravegaActivateProductBySkuRepository } from 'src/core/drivers/repositories/fravega/status/activate/sku/FravegaActivateProductBySkuRepository';

@Module({
  controllers: [FravegaActivateProductController],
  providers: [
    FravegaActivateProductService,
    {
      provide: 'IFravegaActivateProductByIdRepository',
      useClass: FravegaActivateProductByIdRepository
    },
    {
      provide: 'IFravegaActivateProductBySkuRepository',
      useClass: FravegaActivateProductBySkuRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaActivateProductService]
})
export class FravegaActivateProductModule {}
