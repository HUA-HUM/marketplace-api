export interface IFravegaAprobeProductBySkuRepository {
  execute(refId: string): Promise<any>;
}
