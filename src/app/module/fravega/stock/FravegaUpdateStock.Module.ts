import { Module } from '@nestjs/common';
import { FravegaUpdateStockController } from 'src/app/controller/fravega/stock/FravegaUpdateStock.controller';
import { FravegaUpdateStockService } from 'src/app/services/fravega/stock/FravegaUpdateStockService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaUpdateStockByIdRepository } from 'src/core/drivers/repositories/fravega/stock/refeId/FravegaUpdateStockByIdRepository';
import { FravegaUpdateStockBySkuRepository } from 'src/core/drivers/repositories/fravega/stock/sku/FravegaUpdateStockBySkuRepository';

@Module({
  controllers: [FravegaUpdateStockController],
  providers: [
    FravegaUpdateStockService,
    {
      provide: 'IFravegaUpdateStockByIdRepository',
      useClass: FravegaUpdateStockByIdRepository
    },
    {
      provide: 'IFravegaUpdateStockBySkuRepository',
      useClass: FravegaUpdateStockBySkuRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaUpdateStockService]
})
export class FravegaUpdateStockModule {}
