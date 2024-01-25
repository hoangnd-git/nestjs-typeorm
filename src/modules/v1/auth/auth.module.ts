import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../../user/user.module';
import { MailModule } from '../../../providers/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
