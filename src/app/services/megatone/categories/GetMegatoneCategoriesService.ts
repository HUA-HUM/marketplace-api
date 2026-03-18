import { Injectable, Inject } from '@nestjs/common';
import { IMegatoneGetCategoriesRepository } from 'src/core/adapters/repositories/megatone/categories/IMegatoneGetCategoriesRepository';

@Injectable()
export class GetMegatoneCategoriesService {
  constructor(
    @Inject('IMegatoneGetCategoriesRepository')
    private readonly repository: IMegatoneGetCategoriesRepository
  ) {}

  async execute(page: number) {
    const categories = await this.repository.getCategories({ page });

    return {
      page,
      count: categories.length,
      categories
    };
  }

  async getAll() {
    let page = 1;
    let all: { codigo: number; descripcion: string }[] = [];

    while (true) {
      const categories = await this.repository.getCategories({ page });

      if (!categories.length) break;

      all.push(...categories);
      page++;
    }

    return {
      total: all.length,
      categories: all
    };
  }
}
