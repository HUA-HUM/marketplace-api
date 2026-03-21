import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MegatoneProductsModule } from './module/megatone/products/MegatoneProducts.Module';
import { OnCityOrdersModule } from './module/oncity/orders/OncityOrders.Module';
import { OnCityBrandsModule } from './module/oncity/brands/OnCityBrands.Module';
import { OnCityProductsModule } from './module/oncity/products/OncityProducts.Module';
import { MegatoneOrdersModule } from './module/megatone/orders/MegatoneOrders.module';
import { GetBrandsModule } from './module/fravega/brands/GetBrands.Module';
import { GetCategoriesModule } from './module/fravega/categories/GetCategories.Module';
import { MegatoneBrandsModule } from './module/megatone/brands/MegatoneBrands.Module';
import { MegatoneCategoriesModule } from './module/megatone/categories/MegatoneCategories.Module';
import { GetProductsModule } from './module/fravega/products/get/GetProducts.Module';
import { FravegaPublishProductModule } from './module/fravega/products/publish/fravega-publishProduct.module';
import { FravegaActivateProductModule } from './module/fravega/status/activate/FravegaActivateProduct.Module';
import { FravegaDesactivateProductModule } from './module/fravega/status/desactivate/FravegaDesactivateProduct.Module';
import { FravegaAprobeProductModule } from './module/fravega/status/aprobe/FravegaAprobeProduct.Module';
import { FravegaUpdatePriceModule } from './module/fravega/price/FravegaUpdatePrice.Module';
import { FravegaUpdateItemModule } from './module/fravega/update/FravegaUpdateItem.Module';
import { FravegaUpdateStockModule } from './module/fravega/stock/FravegaUpdateStock.Module';
import { FravegaOrdersModule } from './module/fravega/orders/FravegaOrders.Module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MegatoneProductsModule,
    OnCityOrdersModule,
    OnCityBrandsModule,
    OnCityProductsModule,
    MegatoneOrdersModule,
    GetBrandsModule,
    GetCategoriesModule,
    GetProductsModule,
    FravegaPublishProductModule,
    FravegaActivateProductModule,
    FravegaDesactivateProductModule,
    FravegaAprobeProductModule,
    FravegaUpdatePriceModule,
    FravegaUpdateItemModule,
    FravegaUpdateStockModule,
    FravegaOrdersModule,
    MegatoneBrandsModule,
    MegatoneCategoriesModule
  ]
})
export class AppModule {}
