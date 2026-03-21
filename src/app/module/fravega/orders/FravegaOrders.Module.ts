import { Module } from '@nestjs/common';
import { FravegaGetOrdersController } from 'src/app/controller/fravega/orders/FravegaGetOrders.controller';
import { FravegaGetOrdersService } from 'src/app/services/fravega/orders/FravegaGetOrdersService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaGetOrdersRepository } from 'src/core/drivers/repositories/fravega/orders/FravegaGetOrdersRepository';

@Module({
  controllers: [FravegaGetOrdersController],
  providers: [
    FravegaGetOrdersService,
    {
      provide: 'IFravegaGetOrdersRepository',
      useClass: FravegaGetOrdersRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaGetOrdersService]
})
export class FravegaOrdersModule {}
