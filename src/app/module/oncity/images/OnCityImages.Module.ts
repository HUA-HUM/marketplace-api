import { Module } from '@nestjs/common';
import { OnCityImageUploadController } from 'src/app/controller/oncity/images/OnCityImageUpload.Controller';
import { OnCityImageUploadService } from 'src/app/services/oncity/images/OnCityImageUploadService';
import { OnCityAppTokenLoginRepository } from 'src/core/drivers/repositories/oncity/auth/OnCityAppTokenLoginRepository';
import { OnCityImageUploadRepository } from 'src/core/drivers/repositories/oncity/images/OnCityImageUploadRepository';

@Module({
  controllers: [OnCityImageUploadController],
  providers: [
    OnCityImageUploadService,
    {
      provide: 'IOnCityImageUploadRepository',
      useClass: OnCityImageUploadRepository
    },
    {
      provide: 'IOnCityAppTokenLoginRepository',
      useClass: OnCityAppTokenLoginRepository
    }
  ],
  exports: [OnCityImageUploadService]
})
export class OnCityImagesModule {}
