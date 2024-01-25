export interface IEncryption {
  clientProxy: any;
  encrypt(str: string): Promise<string>;
  decrypt(str: string): Promise<string>;
}
