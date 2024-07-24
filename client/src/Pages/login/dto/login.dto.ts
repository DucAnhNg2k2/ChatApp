import { UserType } from "../../../enum/user-type.enum";

export interface LoginDto {
  email: string;
  password: string;
  type: UserType;
}
