import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
