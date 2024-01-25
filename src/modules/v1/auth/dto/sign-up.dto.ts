import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { REGEX_VERIFY_PASSWORD } from '../../../../constants/constants';

export class UserSignUpDto {
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
    maxLength: 256,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(REGEX_VERIFY_PASSWORD)
  password: string;
}
