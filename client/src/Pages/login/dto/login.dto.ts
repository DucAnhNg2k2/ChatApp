import { UserType } from "../../../type/user-type.enum";

export interface LoginDto {
  email: string;
  password: string;
  type: UserType;
}
