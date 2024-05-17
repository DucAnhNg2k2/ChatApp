import { Inject, Injectable } from '@nestjs/common';
import {
  QUEUE_MODULE_OPTIONS,
  QueueModuleOptions,
  QueueOptions,
} from './queue.const';
import * as Bull from 'bull';

@Injectable()
export class QueueService {
  private queue: Bull.Queue;

  constructor(
    @Inject(QUEUE_MODULE_OPTIONS)
    private queueOptions: QueueOptions,
  ) {
    this.queue = new Bull('queue-mail-chat-app', {
      redis: {
        host: this.queueOptions.host,
        port: this.queueOptions.port,
        password: this.queueOptions.password,
        username: this.queueOptions.user,
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    });
    this.initConsumer();
  }

  private initConsumer() {
    this.queue.process(async (job) => {
      console.log(job.data);
      return true;
    });
  }
}
