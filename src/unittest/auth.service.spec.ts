import { Test, TestingModule } from '@nestjs/testing';
import 'dotenv/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { dataSourceTestOptions } from '../../db/data-source-test';
import { AuthService } from '../modules/v1/auth/auth.service';
import { AuthModule } from '../modules/v1/auth/auth.module';
import { TestUtils } from './test.utils';
import { Repository } from 'typeorm';
import UserEntity from '../entities/user.entity';
import { IUser } from '../modules/user/interfaces/user.interface';
import * as CryptoJS from 'crypto-js';
import { ApiError } from '../responses/api-error';
import { ERROR_CODE } from '../constants/constants';
import Utils from '../common/utils';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: AuthService;
  let userModel: Repository<any>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(dataSourceTestOptions), AuthModule],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(async () => {
    await TestUtils.clearDB(module);
  });

  it('Case: user sign up and verify otp success', async () => {
    const sighUpRequest = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: 'Aa123456',
    };
    await authService.signUp(sighUpRequest);
    const u = await userModel
      .createQueryBuilder('u')
      .where('u.email = :email', { email: sighUpRequest.email })
      .getOne();
    await authService.verifyOtpForSignUp({
      email: sighUpRequest.email,
      otp: u.otp,
    });
    expect('signUp').toBeTruthy();
  });

  it('Case: user already existed', async () => {
    const userData: IUser = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: CryptoJS.SHA256('Aa123456').toString(),
      verified: false,
      otp: '',
    };
    await userModel.save(userData);
    const sighUpRequest = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: 'Aa123456',
    };
    try {
      await authService.signUp(sighUpRequest);
    } catch (err) {
      expect(err).toMatchObject(new ApiError(ERROR_CODE.DUPLICATE_ERROR));
    }
  });

  it('Case: user sign up and verify otp fail', async () => {
    const sighUpRequest = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: 'Aa123456',
    };
    await authService.signUp(sighUpRequest);
    try {
      await authService.verifyOtpForSignUp({
        email: sighUpRequest.email,
        otp: Utils.generateOTP(),
      });
    } catch (err) {
      expect(err).toMatchObject(new ApiError(ERROR_CODE.INVALID_DATA_ERROR));
    }
  });

  it('Case: user login success', async () => {
    const userData: IUser = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: CryptoJS.SHA256('Aa123456').toString(),
      verified: true,
      otp: '',
    };
    await userModel.save(userData);
    const loginRequest = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: 'Aa123456',
    };
    const r = await authService.userLogin(loginRequest);
    expect(r).toBeTruthy();
  });

  it('Case: user login fail due to not found user', async () => {
    const loginRequest = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: 'Aa123456',
    };
    try {
      const r = await authService.userLogin(loginRequest);
    } catch (err) {
      expect(err).toMatchObject(new ApiError(ERROR_CODE.INVALID_DATA_ERROR));
    }
  });

  it('Case: user login fail due to wrong password', async () => {
    const userData: IUser = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: CryptoJS.SHA256('Aa123456').toString(),
      verified: true,
      otp: '',
    };
    await userModel.save(userData);
    const loginRequest = {
      email: 'hoangnguyenduy.ptit@gmail.com',
      password: 'Aa123457',
    };
    try {
      const r = await authService.userLogin(loginRequest);
    } catch (err) {
      expect(err).toMatchObject(new ApiError(ERROR_CODE.INVALID_DATA_ERROR));
    }
  });
});
