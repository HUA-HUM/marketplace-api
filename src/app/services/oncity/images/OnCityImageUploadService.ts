import { Inject, Injectable } from '@nestjs/common';
import {
  IOnCityImageUploadRepository,
  OnCityImageUploadCommand
} from 'src/core/adapters/repositories/oncity/images/IOnCityImageUploadRepository';

@Injectable()
export class OnCityImageUploadService {
  constructor(
    @Inject('IOnCityImageUploadRepository')
    private readonly repository: IOnCityImageUploadRepository
  ) {}

  async execute(command: OnCityImageUploadCommand): Promise<unknown> {
    return this.repository.execute(command);
  }
}
