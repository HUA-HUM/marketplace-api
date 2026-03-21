export interface IFravegaActivateProductByIdRepository {
  execute(id: string): Promise<any>;
}
