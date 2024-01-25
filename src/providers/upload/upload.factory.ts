import { Injectable } from '@nestjs/common';
import { CLOUD_STORAGE_TYPE } from '../../constants/constants';
import { IUploadFile } from './upload.interface';
import { UploadS3 } from './upload-s3';
import { UploadHuawei } from './upload-huawei';

@Injectable()
export class UploadFactory {
  public getUploadService(): IUploadFile {
    const cloud = process.env.CLOUD_STORAGE_TYPE;
    if (cloud === CLOUD_STORAGE_TYPE.AWS) {
      return new UploadS3();
    } else if (cloud === CLOUD_STORAGE_TYPE.HUAWEI) {
      return new UploadHuawei();
    } else {
      return new UploadS3();
    }
  }
}
