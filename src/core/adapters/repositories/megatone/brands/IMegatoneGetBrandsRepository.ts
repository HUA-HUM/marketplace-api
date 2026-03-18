export interface IMegatoneGetBrandsRepository {
  getBrands(params: { page: number }): Promise<{ codigo: number; descripcion: string }[]>;
}
