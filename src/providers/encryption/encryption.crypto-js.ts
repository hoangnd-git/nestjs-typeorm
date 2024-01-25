import { IEncryption } from './encryption.interface';
import * as CryptoJS from 'crypto-js';
export const DEFAULT_SECRET_KEY = 'Aa@123';
export class EncryptionCryptoJs implements IEncryption {
  clientProxy!: any;

  async decrypt(str: string): Promise<string> {
    return CryptoJS.AES.decrypt(str, DEFAULT_SECRET_KEY).toString();
  }

  async encrypt(str: string): Promise<string> {
    return CryptoJS.AES.encrypt(str, DEFAULT_SECRET_KEY).toString();
  }
}
