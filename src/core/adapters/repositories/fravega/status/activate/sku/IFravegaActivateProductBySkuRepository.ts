export interface IFravegaActivateProductBySkuRepository {
  execute(refId: string): Promise<any>;
}
