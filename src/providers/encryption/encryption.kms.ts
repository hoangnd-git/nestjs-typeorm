import { IEncryption } from './encryption.interface';
import { DecryptCommand, EncryptCommand, KMSClient } from '@aws-sdk/client-kms';

export class EncryptionKMS implements IEncryption {
  clientProxy!: KMSClient;
  constructor() {
    this.clientProxy = new KMSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KMS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_KMS_SECRET_ACCESS_KEY,
      },
    });
  }

  async decrypt(str: string): Promise<string> {
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(str, 'base64'),
      KeyId: process.env.AWS_KMS_ACCESS_KEY_ID,
    });
    const response = await this.clientProxy.send(command);
    return response.Plaintext.toString();
  }

  async encrypt(str: string): Promise<string> {
    const command = new EncryptCommand({
      KeyId: process.env.AWS_KMS_ACCESS_KEY_ID,
      Plaintext: Buffer.from(str, 'base64'),
    });
    const response = await this.clientProxy.send(command);
    return response.CiphertextBlob.toString();
  }
}
