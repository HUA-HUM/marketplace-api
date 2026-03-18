import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MegatoneBrandsController } from 'src/app/controller/megatone/brands/MegatoneBrands.Controller';
import { GetMegatoneBrandsService } from 'src/app/services/megatone/brands/GetMegatoneBrandsServices';
import { InMemoryCacheManager } from 'src/core/drivers/cache/InMemoryCacheManager';
import { MegatoneAuthRepository } from 'src/core/drivers/repositories/megatone/auth/MegatoneAuthRepository';
import { MegatoneGetBrandsRepository } from 'src/core/drivers/repositories/megatone/brands/MegatoneGetBrandsRepository';
import { MegatoneHttpClient } from 'src/core/drivers/repositories/megatone/http/MegatoneHttpClient';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [MegatoneBrandsController],
  providers: [
    GetMegatoneBrandsService,
    {
      provide: 'IMegatoneGetBrandsRepository',
      useClass: MegatoneGetBrandsRepository
    },
    {
      provide: 'ICacheManager',
      useClass: InMemoryCacheManager
    },
    MegatoneHttpClient,
    MegatoneAuthRepository
  ],
  exports: [GetMegatoneBrandsService]
})
export class MegatoneBrandsModule {}
