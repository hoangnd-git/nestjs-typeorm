import { ApiError } from '../../responses/api-error';
import { IUploadFile, UploadFileResponse } from './upload.interface';
const ObsClient = require('esdk-obs-nodejs');
import { Readable } from 'stream';

export class UploadHuawei implements IUploadFile {
  clientProxy!: any;
  constructor() {
    this.clientProxy = new ObsClient({
      access_key_id: process.env.HUAWEI_OBS_ACCESS_KEY_ID,
      secret_access_key: process.env.HUAWEI_OBS_SECRET_ACCESS_KEY,
      server: process.env.HUAWEI_OBS_ENDPOINT,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadFileResponse> {
    const key = folder
      ? `${folder}/${new Date().getTime()}-${file.originalname.replace(
          /[^.a-zA-Z0-9]/g,
          '',
        )}`
      : `${new Date().getTime()}-${file.originalname.replace(
          /[^.a-zA-Z0-9]/g,
          '',
        )}`;
    try {
      await this.clientProxy.putObject({
        Bucket: process.env.HUAWEI_OBS_BUCKET,
        Key: key,
        Body: Readable.from(file.buffer),
        ContentType: file.mimetype,
        ACL: 'public-read',
      });
    } catch (err: any) {
      throw new ApiError();
    }
    return {
      url: `${process.env.HUAWEI_OBS_BUCKET_ENDPOINT}/${key}`,
    };
  }
}
