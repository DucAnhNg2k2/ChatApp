export enum UserType {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  EMAIL = 'email',
}

export enum VerifyOTPType {
  REGISTER = 'register',
  FORGOT_PASSWORD = 'forgot_password',
}

export interface typeJobReceiveSendMail {
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

export class UserReq {
  id: number;
}

export const PATTERN = {
  VERIFY_AUTH: 'VERIFY_AUTH',
};
