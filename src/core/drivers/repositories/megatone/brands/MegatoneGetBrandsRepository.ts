import { Injectable, Logger } from '@nestjs/common';
import { MegatoneHttpClient } from '../http/MegatoneHttpClient';
import { IMegatoneGetBrandsRepository } from 'src/core/adapters/repositories/megatone/brands/IMegatoneGetBrandsRepository';

@Injectable()
export class MegatoneGetBrandsRepository implements IMegatoneGetBrandsRepository {
  private readonly logger = new Logger(MegatoneGetBrandsRepository.name);

  constructor(private readonly httpClient: MegatoneHttpClient) {}

  async getBrands(params: { page: number }): Promise<{ codigo: number; descripcion: string }[]> {
    try {
      const response = await this.httpClient.get<any>('/Marcas/BuscarMarca', {
        params: {
          NumeroPagina: params.page
        }
      });

      return (
        response.Elementos?.map((brand: any) => ({
          codigo: brand.codigo,
          descripcion: brand.descripcion
        })) ?? []
      );
    } catch (error: any) {
      this.logger.warn('[MegatoneBrands] Error obteniendo marcas', {
        page: params.page,
        message: error?.message
      });

      return [];
    }
  }
}
