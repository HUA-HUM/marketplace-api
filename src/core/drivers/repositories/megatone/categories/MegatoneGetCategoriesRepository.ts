import { Injectable, Logger } from '@nestjs/common';
import { MegatoneHttpClient } from '../http/MegatoneHttpClient';
import { IMegatoneGetCategoriesRepository } from 'src/core/adapters/repositories/megatone/categories/IMegatoneGetCategoriesRepository';

@Injectable()
export class MegatoneGetCategoriesRepository implements IMegatoneGetCategoriesRepository {
  private readonly logger = new Logger(MegatoneGetCategoriesRepository.name);

  constructor(private readonly httpClient: MegatoneHttpClient) {}

  async getCategories(params: { page: number }): Promise<{ codigo: number; descripcion: string }[]> {
    try {
      const response = await this.httpClient.get<any>('/Categorias/BusquedaMasiva', {
        params: {
          NumeroPagina: params.page
        }
      });

      return (
        response.Elementos?.map((cat: any) => ({
          codigo: cat.Codigo,
          descripcion: cat.Descripcion
        })) ?? []
      );
    } catch (error: any) {
      this.logger.warn('[MegatoneCategories] Error obteniendo categorías', {
        page: params.page,
        message: error?.message
      });

      return [];
    }
  }
}
