import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyOtpForSignUpDto {
  @ApiProperty({
    required: true,
    type: String,
    maxLength: 256,
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(256)
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 6,
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  otp: string;
}
