import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser } from './interfaces/user.interface';
import UserEntity from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async createNewUser(user: IUser): Promise<string> {
    return await this.userRepository.createNewUser(user);
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.selectOne('u.email = :email', {
      email,
    });
  }

  public async getUserWithOtp(email: string, otp: string): Promise<UserEntity> {
    return await this.userRepository.selectOne(
      'u.email = :email AND u.otp = :otp',
      {
        email,
        otp,
      },
    );
  }

  public async userVerifySignup(email: string): Promise<void> {
    await this.userRepository.update(
      'email = :email',
      {
        email,
      },
      {
        otp: '',
        verified: true,
      },
    );
  }

  public async userLogin(email: string, password: string): Promise<UserEntity> {
    return await this.userRepository.selectOne(
      'u.email = :email AND u.password = :password',
      {
        email,
        password,
      },
    );
  }

  public async userGetProfile(email: string): Promise<UserEntity> {
    return await this.userRepository.selectOne(
      'u.email = :email',
      {
        email,
      },
      ['u.email'],
    );
  }
}
