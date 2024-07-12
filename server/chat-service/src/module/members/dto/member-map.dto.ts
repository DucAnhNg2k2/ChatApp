import { IsNotEmpty, IsNumberString } from 'class-validator';

export class MapToMemberChat {
  userId: number;
  name: string;
  address: string;
}
