import { DynamicModule, Global, Module } from '@nestjs/common';
import { MAIL_MODULE_OPTIONS, MailModuleOptions } from './mail.const';
import { MailService } from './mail.service';

@Global()
@Module({})
export class MailModule {
  static forRootAsync(mailModuleOptions: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      imports: mailModuleOptions.imports,
      providers: [
        {
          provide: MAIL_MODULE_OPTIONS,
          useFactory: mailModuleOptions.useFactory,
          inject: mailModuleOptions.inject,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
