import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MegatoneCategoriesController } from 'src/app/controller/megatone/categories/MegatoneCategories.Controller';
import { GetMegatoneCategoriesService } from 'src/app/services/megatone/categories/GetMegatoneCategoriesService';
import { InMemoryCacheManager } from 'src/core/drivers/cache/InMemoryCacheManager';
import { MegatoneAuthRepository } from 'src/core/drivers/repositories/megatone/auth/MegatoneAuthRepository';
import { MegatoneGetCategoriesRepository } from 'src/core/drivers/repositories/megatone/categories/MegatoneGetCategoriesRepository';
import { MegatoneHttpClient } from 'src/core/drivers/repositories/megatone/http/MegatoneHttpClient';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [MegatoneCategoriesController],
  providers: [
    GetMegatoneCategoriesService,
    MegatoneHttpClient,
    {
      provide: 'IMegatoneGetCategoriesRepository',
      useClass: MegatoneGetCategoriesRepository
    },
    {
      provide: 'ICacheManager',
      useClass: InMemoryCacheManager
    },
    MegatoneAuthRepository
  ],
  exports: [GetMegatoneCategoriesService]
})
export class MegatoneCategoriesModule {}
