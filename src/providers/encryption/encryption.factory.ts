import { Injectable } from '@nestjs/common';
import { IEncryption } from './encryption.interface';
import { CLOUD_ENCRYPTION_TYPE } from '../../constants/constants';
import { EncryptionKMS } from './encryption.kms';
import { EncryptionCryptoJs } from './encryption.crypto-js';

@Injectable()
export class EncryptionFactory {
  public getEncryptionService(): IEncryption {
    const cloud = process.env.CLOUD_ENCRYPTION_TYPE;
    if (cloud === CLOUD_ENCRYPTION_TYPE.AWS) {
      return new EncryptionKMS();
    } else {
      return new EncryptionCryptoJs();
    }
  }
}
