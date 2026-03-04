import { Inject, Injectable } from '@nestjs/common';
import { IFravegaGetBrandsRepository } from 'src/core/adapters/repositories/fravega/brands/IFravegaGetBrandsRepository';
import { FravegaBrand } from 'src/core/entities/fravega/brands/FravegaBrand';

@Injectable()
export class GetBrandsService {
  constructor(
    @Inject('IFravegaGetBrandsRepository')
    private readonly brandsRepository: IFravegaGetBrandsRepository
  ) {}

  async GetAllBrands(): Promise<FravegaBrand[]> {
    return this.brandsRepository.execute();
  }
}
