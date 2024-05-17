import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/const/const';

export class AuthRegisterEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  type: UserType;
}
