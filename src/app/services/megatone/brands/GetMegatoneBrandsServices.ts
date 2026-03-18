import { Injectable, Inject } from '@nestjs/common';
import { IMegatoneGetBrandsRepository } from 'src/core/adapters/repositories/megatone/brands/IMegatoneGetBrandsRepository';

@Injectable()
export class GetMegatoneBrandsService {
  constructor(
    @Inject('IMegatoneGetBrandsRepository')
    private readonly repository: IMegatoneGetBrandsRepository
  ) {}

  async execute(page: number) {
    const brands = await this.repository.getBrands({ page });

    return {
      page,
      count: brands.length,
      brands
    };
  }

  async getAll() {
    let page = 1;
    let allBrands: { codigo: number; descripcion: string }[] = [];

    while (true) {
      const brands = await this.repository.getBrands({ page });

      if (!brands.length) break;

      allBrands.push(...brands);
      page++;
    }

    return {
      total: allBrands.length,
      brands: allBrands
    };
  }
}
