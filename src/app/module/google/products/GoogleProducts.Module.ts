import { Module } from '@nestjs/common';
import { GoogleProductsController } from 'src/app/controller/google/products/GoogleProducts.Controller';
import { DeleteGoogleProductService } from 'src/app/services/google/products/DeleteGoogleProductService';
import { GetGoogleProductPerformanceService } from 'src/app/services/google/products/GetGoogleProductPerformanceService';
import { GetGoogleProductService } from 'src/app/services/google/products/GetGoogleProductService';
import { PublishGoogleProductService } from 'src/app/services/google/products/PublishGoogleProductService';
import { UpdateGooglePriceService } from 'src/app/services/google/products/UpdateGooglePriceService';
import { UpdateGoogleStatusService } from 'src/app/services/google/products/UpdateGoogleStatusService';
import { UpdateGoogleStockService } from 'src/app/services/google/products/UpdateGoogleStockService';
import { GoogleMerchantAuthRepository } from 'src/app/driver/google/auth/GoogleMerchantAuthRepository';
import { GoogleMerchantConfig } from 'src/core/drivers/repositories/google/config/GoogleMerchantConfig';
import { DeleteProductsRepository } from 'src/core/drivers/repositories/google/DeleteProducts/DeleteProductsRepository';
import { GetProductsRepository } from 'src/core/drivers/repositories/google/GetProducts/GetProductsRepository';
import { GoogleMerchantHttpClient } from 'src/core/drivers/repositories/google/http/GoogleMerchantHttpClient';
import { PostProductsRepository } from 'src/core/drivers/repositories/google/PostProducts/PostProductsRepository';
import { GetProductPerformanceRepository } from 'src/core/drivers/repositories/google/reports/GetProductPerformanceRepository';
import { UpdatePriceRepository } from 'src/core/drivers/repositories/google/Update/UpdatePrice/UpdatePriceRepository';
import { UpdateStatusRepository } from 'src/core/drivers/repositories/google/Update/updateStatus/UpdateStatusRepository';
import { UpdateStockRepository } from 'src/core/drivers/repositories/google/Update/updateStock/UpdateStockRepository';

@Module({
  controllers: [GoogleProductsController],
  providers: [
    PublishGoogleProductService,
    GetGoogleProductService,
    GetGoogleProductPerformanceService,
    DeleteGoogleProductService,
    UpdateGooglePriceService,
    UpdateGoogleStockService,
    UpdateGoogleStatusService,
    GoogleMerchantConfig,
    {
      provide: 'IGoogleMerchantAuthRepository',
      useClass: GoogleMerchantAuthRepository
    },
    {
      provide: 'IPostProductsRepository',
      useClass: PostProductsRepository
    },
    {
      provide: 'IGetProductsRepository',
      useClass: GetProductsRepository
    },
    {
      provide: 'IGetProductPerformanceRepository',
      useClass: GetProductPerformanceRepository
    },
    {
      provide: 'IDeleteProductsRepository',
      useClass: DeleteProductsRepository
    },
    {
      provide: 'IUpdatePriceRepository',
      useClass: UpdatePriceRepository
    },
    {
      provide: 'IUpdateStockRepository',
      useClass: UpdateStockRepository
    },
    {
      provide: 'IUpdateStatusRepository',
      useClass: UpdateStatusRepository
    },
    GoogleMerchantHttpClient
  ],
  exports: [
    PublishGoogleProductService,
    GetGoogleProductService,
    GetGoogleProductPerformanceService,
    DeleteGoogleProductService,
    UpdateGooglePriceService,
    UpdateGoogleStockService,
    UpdateGoogleStatusService
  ]
})
export class GoogleProductsModule {}
