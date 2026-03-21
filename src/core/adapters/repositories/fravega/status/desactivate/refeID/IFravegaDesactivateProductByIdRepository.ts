export interface IFravegaDesactivateProductByIdRepository {
  execute(id: string): Promise<any>;
}
