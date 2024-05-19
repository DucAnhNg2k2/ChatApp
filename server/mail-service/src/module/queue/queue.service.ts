import { Inject, Injectable } from '@nestjs/common';
import {
  QUEUE_MODULE_OPTIONS,
  QueueModuleOptions,
  QueueOptions,
} from './queue.const';
import * as Bull from 'bull';
import { MailService } from '../mail/mail.service';
import { typeJobReceiveSendMail } from 'src/const/const';

@Injectable()
export class QueueService {
  private queue: Bull.Queue<typeJobReceiveSendMail>;

  constructor(
    @Inject(QUEUE_MODULE_OPTIONS)
    private queueOptions: QueueOptions,
    private readonly mailService: MailService,
  ) {
    this.queue = new Bull<typeJobReceiveSendMail>('queue-mail-chat-app', {
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
      const { to, subject, text, html } = job.data;
      await this.mailService.sendMail(to, subject, text, html);
      return true;
    });
  }
}
