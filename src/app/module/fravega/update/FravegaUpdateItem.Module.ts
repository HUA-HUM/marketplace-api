import { Module } from '@nestjs/common';
import { FravegaUpdateItemController } from 'src/app/controller/fravega/update/FravegaUpdateItem.controller';
import { FravegaUpdateItemService } from 'src/app/services/fravega/update/FravegaUpdateItemService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaUpdateItemByIdRepository } from 'src/core/drivers/repositories/fravega/update/Id/FravegaUpdateItemByIdRepository';
import { FravegaUpdateItemByRefIdRepository } from 'src/core/drivers/repositories/fravega/update/refeId/FravegaUpdateItemByRefIdRepository';

@Module({
  controllers: [FravegaUpdateItemController],
  providers: [
    FravegaUpdateItemService,
    {
      provide: 'IFravegaUpdateItemByIdRepository',
      useClass: FravegaUpdateItemByIdRepository
    },
    {
      provide: 'IFravegaUpdateItemByRefIdRepository',
      useClass: FravegaUpdateItemByRefIdRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaUpdateItemService]
})
export class FravegaUpdateItemModule {}
