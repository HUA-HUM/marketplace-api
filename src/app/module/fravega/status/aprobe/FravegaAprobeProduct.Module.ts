import { Module } from '@nestjs/common';
import { FravegaAprobeProductController } from 'src/app/controller/fravega/status/aprobe/FravegaAprobeProduct.controller';
import { FravegaAprobeProductService } from 'src/app/services/fravega/status/aprobe/FravegaAprobeProductService';
import { FravegaConfig } from 'src/core/drivers/repositories/fravega/Config/FravegaConfig';
import { FravegaHttpClient } from 'src/core/drivers/repositories/fravega/http/FravegaHttpClient';
import { FravegaAprobeProductByIdRepository } from 'src/core/drivers/repositories/fravega/status/aprobe/refeID/FravegaAprobeProductByIdRepository';
import { FravegaAprobeProductBySkuRepository } from 'src/core/drivers/repositories/fravega/status/aprobe/sku/FravegaAprobeProductBySkuRepository';

@Module({
  controllers: [FravegaAprobeProductController],
  providers: [
    FravegaAprobeProductService,
    {
      provide: 'IFravegaAprobeProductByIdRepository',
      useClass: FravegaAprobeProductByIdRepository
    },
    {
      provide: 'IFravegaAprobeProductBySkuRepository',
      useClass: FravegaAprobeProductBySkuRepository
    },
    FravegaHttpClient,
    FravegaConfig
  ],
  exports: [FravegaAprobeProductService]
})
export class FravegaAprobeProductModule {}
