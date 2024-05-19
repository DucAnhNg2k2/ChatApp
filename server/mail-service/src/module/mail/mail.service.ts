import { Inject, Injectable } from '@nestjs/common';
import { MAIL_MODULE_OPTIONS, MailOptions } from './mail.const';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    @Inject(MAIL_MODULE_OPTIONS) private readonly mailOptions: MailOptions,
  ) {
    console.log('MailService created', mailOptions);
    this.transporter = nodemailer.createTransport({
      host: mailOptions.host,
      port: mailOptions.port,
      secure: mailOptions.secure,
      auth: {
        user: mailOptions.user,
        pass: mailOptions.password,
      },
    });
  }

  async sendMail(to: string[], subject: string, text: string, html?: string) {
    const info = await this.transporter.sendMail({
      from: this.mailOptions.user,
      to,
      subject,
      text,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  }
}
