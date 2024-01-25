import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IUploadFile, UploadFileResponse } from './upload.interface';
import { ApiError } from '../../responses/api-error';

export class UploadS3 implements IUploadFile {
  clientProxy!: S3Client;
  constructor() {
    this.clientProxy = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
      },
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
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });
    try {
      await this.clientProxy.send(command);
    } catch (err: any) {
      throw new ApiError();
    }
    return {
      url: `${process.env.AWS_S3_URL}/${key}`,
    };
  }
}
