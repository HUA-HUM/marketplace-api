import { Module } from '@nestjs/common';
import { FravegaVtexOrdersController } from 'src/app/controller/fravega/vtex/orders/FravegaVtexOrders.Controller';
import { FravegaVtexOrdersService } from 'src/app/services/fravega/vtex/orders/FravegaVtexOrdersService';
import { FravegaVtexHttpClient } from 'src/core/drivers/repositories/fravega/vtex/http/FravegaVtexHttpClient';
import { FravegaVtexOrdersRepository } from 'src/core/drivers/repositories/fravega/vtex/orders/FravegaVtexOrdersRepository';

@Module({
  controllers: [FravegaVtexOrdersController],
  providers: [
    FravegaVtexOrdersService,
    {
      provide: 'IFravegaVtexOrdersRepository',
      useClass: FravegaVtexOrdersRepository
    },
    FravegaVtexHttpClient
  ],
  exports: [FravegaVtexOrdersService]
})
export class FravegaVtexOrdersModule {}
