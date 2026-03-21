import { Module } from '@nestjs/common';
import { FravegaUpdatePriceController } from 'src/app/controller/fravega/price/FravegaUpdatePrice.controller';
import { FravegaUpdatePriceService } from 'src/app/services/fravega/price/FravegaUpdatePriceService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaUpdatePriceByIdRepository } from 'src/core/drivers/repositories/fravega/price/refeId/FravegaUpdatePriceByIdRepository';
import { FravegaUpdatePriceBySkuRepository } from 'src/core/drivers/repositories/fravega/price/sku/FravegaUpdatePriceBySkuRepository';

@Module({
  controllers: [FravegaUpdatePriceController],
  providers: [
    FravegaUpdatePriceService,
    {
      provide: 'IFravegaUpdatePriceByIdRepository',
      useClass: FravegaUpdatePriceByIdRepository
    },
    {
      provide: 'IFravegaUpdatePriceBySkuRepository',
      useClass: FravegaUpdatePriceBySkuRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaUpdatePriceService]
})
export class FravegaUpdatePriceModule {}
