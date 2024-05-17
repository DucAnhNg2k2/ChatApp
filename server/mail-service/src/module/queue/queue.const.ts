import { ConfigService } from '@nestjs/config';

export const QUEUE_MODULE_OPTIONS = 'QUEUE_MODULE_OPTIONS';

export interface QueueOptions {
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface QueueModuleOptions {
  imports?: any[];
  useFactory: (ConfigService: ConfigService) => QueueOptions;
  inject?: any[];
}
