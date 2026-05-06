export interface OnCityImageUploadCommand {
  fileName: string;
  originalName?: string;
  mimeType?: string;
  buffer: Buffer;
}

export interface IOnCityImageUploadRepository {
  execute(command: OnCityImageUploadCommand): Promise<unknown>;
}
