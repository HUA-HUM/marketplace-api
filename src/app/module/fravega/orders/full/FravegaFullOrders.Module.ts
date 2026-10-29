import { Module } from '@nestjs/common';
import { FravegaFullOrdersController } from 'src/app/controller/fravega/orders/full/FravegaFullOrders.controller';
import { GetFravegaFullOrdersService } from 'src/app/services/fravega/orders/full/GetFravegaFullOrdersService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaGetOrdersRepository } from 'src/core/drivers/repositories/fravega/orders/FravegaGetOrdersRepository';
import { FravegaVtexHttpClient } from 'src/core/drivers/repositories/fravega/vtex/http/FravegaVtexHttpClient';
import { FravegaVtexOrdersRepository } from 'src/core/drivers/repositories/fravega/vtex/orders/FravegaVtexOrdersRepository';
import { GetFravegaFullOrders } from 'src/core/interactor/fravega/GetFravegaFullOrders';

@Module({
  controllers: [FravegaFullOrdersController],
  providers: [
    GetFravegaFullOrdersService,
    GetFravegaFullOrders,
    {
      provide: 'IFravegaGetOrdersRepository',
      useClass: FravegaGetOrdersRepository
    },
    {
      provide: 'IFravegaVtexOrdersRepository',
      useClass: FravegaVtexOrdersRepository
    },
    FravegaHttpClient,
    FravegaConfig,
    FravegaVtexHttpClient
  ],
  exports: [GetFravegaFullOrdersService]
})
export class FravegaFullOrdersModule {}
