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
  MAP_TO_MEMBER_CHAT: 'MAP_TO_MEMBER_CHAT',
};

export const ChatService = {
  CHAT_SERVICE: 'CHAT_SERVICE',
  CHAT_SERVICE_HOST: 'CHAT_SERVICE_HOST',
  CHAT_SERVICE_PORT: 'CHAT_SERVICE_PORT',
  CHAT_SERVICE_TRANSPORT_PORT: 'CHAT_SERVICE_TRANSPORT_PORT',
};
