export interface IFravegaAprobeProductByIdRepository {
  execute(id: string): Promise<any>;
}
