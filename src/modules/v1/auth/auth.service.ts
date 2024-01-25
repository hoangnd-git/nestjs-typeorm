import { Body, Injectable } from '@nestjs/common';
import { UserSignUpDto } from './dto/sign-up.dto';
import { UserService } from '../../user/user.service';
import { ApiError } from '../../../responses/api-error';
import {
  ERROR_CODE,
  MAIL_TEMPLATE,
  TOKEN_CONFIG,
} from '../../../constants/constants';
import * as CryptoJS from 'crypto-js';
import { MailService } from '../../../providers/mail/mail.service';
import Utils from '../../../common/utils';
import { VerifyOtpForSignUpDto } from './dto/verify-otp-for-sign-up.dto';
import { ILoginResponse } from './interfaces/login-response.interface';
import { UserLoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../../../entities/user.entity';
import { IAcessToken } from './interfaces/token.interface';
import { IRefreshTokenResponse } from './interfaces/refresh-token-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  public async signUp(@Body() data: UserSignUpDto): Promise<void> {
    const u = await this.userService.getUserByEmail(data.email);
    if (u) {
      throw new ApiError(ERROR_CODE.DUPLICATE_ERROR);
    }

    const otp = Utils.generateOTP();

    await this.userService.createNewUser({
      email: data.email,
      password: CryptoJS.SHA256(data.password).toString(),
      otp,
      verified: false,
    });

    await this.mailService.addMailToQueue({
      subject: 'Sign up',
      context: {
        otp,
      },
      template: MAIL_TEMPLATE.SIGN_UP,
      toEmail: data.email,
    });
  }

  public async verifyOtpForSignUp(data: VerifyOtpForSignUpDto): Promise<void> {
    const u = await this.userService.getUserWithOtp(data.email, data.otp);
    if (!u) {
      throw new ApiError(ERROR_CODE.INVALID_DATA_ERROR);
    }

    await this.userService.userVerifySignup(data.email);
  }

  public async userLogin(data: UserLoginDto): Promise<ILoginResponse> {
    const u = await this.userService.userLogin(
      data.email,
      CryptoJS.SHA256(data.password).toString(),
    );
    if (!u || (u && !u.verified)) {
      throw new ApiError(ERROR_CODE.INVALID_DATA_ERROR);
    }

    return {
      accessToken: await this.jwtService.signAsync(
        {
          email: data.email,
        },
        {
          expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRE_TIME,
        },
      ),
      refreshToken: await this.jwtService.signAsync(
        {
          email: data.email,
        },
        {
          expiresIn: TOKEN_CONFIG.REFRESH_TOKEN_EXPIRE_TIME,
        },
      ),
    };
  }

  public async userGetProfile(email: string): Promise<UserEntity> {
    return await this.userService.userGetProfile(email);
  }

  public async userRefreshToken(email: string): Promise<IRefreshTokenResponse> {
    return {
      accessToken: await this.jwtService.signAsync(
        {
          email: email,
        },
        {
          expiresIn: TOKEN_CONFIG.ACCESS_TOKEN_EXPIRE_TIME,
        },
      ),
    };
  }
}
