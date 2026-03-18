import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MegatoneProductsModule } from './module/megatone/products/MegatoneProducts.Module';
import { OnCityOrdersModule } from './module/oncity/orders/OncityOrders.Module';
import { OnCityBrandsModule } from './module/oncity/brands/OnCityBrands.Module';
import { OnCityProductsModule } from './module/oncity/products/OncityProducts.Module';
import { MegatoneOrdersModule } from './module/megatone/orders/MegatoneOrders.module';
import { GetBrandsModule } from './module/fravega/brands/GetBrands.Module';
import { GetCategoriesModule } from './module/fravega/categories/GetCategories.Module';
import { FravegaPublishProductModule } from './module/fravega/products/fravega-publishProduct.module';
import { MegatoneBrandsModule } from './module/megatone/brands/MegatoneBrands.Module';
import { MegatoneCategoriesModule } from './module/megatone/categories/MegatoneCategories.Module';

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
    FravegaPublishProductModule,
    MegatoneBrandsModule,
    MegatoneCategoriesModule
  ]
})
export class AppModule {}
