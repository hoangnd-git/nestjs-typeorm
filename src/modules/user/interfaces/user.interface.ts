export interface IUser {
  email: string;
  password: string;
  otp?: string;
  verified?: boolean;
}
