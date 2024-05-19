import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserType } from 'src/const/const';

export class LoginDto {
  @IsOptional()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserType)
  type: UserType;
}
