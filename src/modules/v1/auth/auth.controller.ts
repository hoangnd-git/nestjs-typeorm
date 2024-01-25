import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserSignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { ApiSuccess } from '../../../responses/api-success';
import { VerifyOtpForSignUpDto } from './dto/verify-otp-for-sign-up.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/login.dto';
import { AuthGuard } from '../../../guards/auth-guard';
import { IUserAuth, User } from '../../../decorators/user.decorator';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() data: UserSignUpDto) {
    await this.authService.signUp(data);
    return new ApiSuccess();
  }

  @Post('sign-up/verify-otp')
  public async verifyOtpForSignup(@Body() data: VerifyOtpForSignUpDto) {
    await this.authService.verifyOtpForSignUp(data);
    return new ApiSuccess();
  }

  @Post('login')
  public async login(@Body() data: UserLoginDto) {
    const r = await this.authService.userLogin(data);
    return new ApiSuccess(r);
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async userRefreshToken(@User() user: IUserAuth) {
    const r = await this.authService.userRefreshToken(user.email);
    return new ApiSuccess(r);
  }

  @Post('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  public async userGetProfile(@User() user: IUserAuth) {
    const r = await this.authService.userGetProfile(user.email);
    return new ApiSuccess(r);
  }
}
