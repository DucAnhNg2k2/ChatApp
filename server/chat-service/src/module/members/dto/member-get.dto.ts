import { IsNotEmpty, IsString } from 'class-validator';

export class MemberGetDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
