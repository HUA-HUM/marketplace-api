import { Inject, Injectable } from '@nestjs/common';
import { IOnCityAppTokenLoginRepository } from 'src/core/adapters/repositories/oncity/auth/IOnCityAppTokenLoginRepository';

@Injectable()
export class OnCityAppTokenLoginService {
  constructor(
    @Inject('IOnCityAppTokenLoginRepository')
    private readonly repository: IOnCityAppTokenLoginRepository
  ) {}

  async execute(): Promise<unknown> {
    return this.repository.execute();
  }
}
