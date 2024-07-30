import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
