import { ConfigService } from '@nestjs/config';

export const MAIL_MODULE_OPTIONS = 'MAIL_MODULE_OPTIONS';

export interface MailOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  secure: boolean;
}

export interface MailModuleOptions {
  imports?: any[];
  useFactory: (ConfigService: ConfigService) => MailOptions;
  inject?: any[];
}
