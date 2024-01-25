export interface IUploadFile {
  clientProxy: any;
  uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadFileResponse>;
}

export interface UploadFileResponse {
  url: string;
}
