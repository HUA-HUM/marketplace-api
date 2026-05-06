import { Module } from '@nestjs/common';
import { OnCityAppTokenLoginController } from 'src/app/controller/oncity/auth/OnCityAppTokenLogin.Controller';
import { OnCityAppTokenLoginService } from 'src/app/services/oncity/auth/OnCityAppTokenLoginService';
import { OnCityAppTokenLoginRepository } from 'src/core/drivers/repositories/oncity/auth/OnCityAppTokenLoginRepository';
import { OnCityHttpClient } from 'src/core/drivers/repositories/oncity/http/OnCityHttpClient';

@Module({
  controllers: [OnCityAppTokenLoginController],
  providers: [
    OnCityAppTokenLoginService,
    {
      provide: 'IOnCityAppTokenLoginRepository',
      useClass: OnCityAppTokenLoginRepository
    },
    OnCityHttpClient
  ],
  exports: [OnCityAppTokenLoginService]
})
export class OnCityAuthModule {}
