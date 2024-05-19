import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { QUEUE_MODULE_OPTIONS, QueueModuleOptions } from './queue.const';
import { QueueController } from './queue.controller';

@Global()
@Module({})
export class QueueModule {
  static forRootAsync(queueModuleOptions: QueueModuleOptions): DynamicModule {
    return {
      module: QueueModule,
      imports: queueModuleOptions.imports,
      providers: [
        {
          provide: QUEUE_MODULE_OPTIONS,
          useFactory: queueModuleOptions.useFactory,
          inject: queueModuleOptions.inject,
        },
        QueueService,
      ],
      controllers: [QueueController],
      exports: [QueueService],
    };
  }
}
