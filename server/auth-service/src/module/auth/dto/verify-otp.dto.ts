import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { VerifyOTPType } from 'src/const/const';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsEnum(VerifyOTPType)
  type: VerifyOTPType;
}
