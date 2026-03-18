export interface IMegatoneGetCategoriesRepository {
  getCategories(params: { page: number }): Promise<
    {
      codigo: number;
      descripcion: string;
    }[]
  >;
}
