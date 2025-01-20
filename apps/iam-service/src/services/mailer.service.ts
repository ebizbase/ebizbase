import { NodeMailerService } from '@ebizbase/nestjs-node-mailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { compile } from 'handlebars';
import {
  EmailEvent,
  EmailTemplateModel,
  InjectEmailTemplateModel,
} from '../schemas/email-template.schema';

export interface IMailAddress {
  name: string;
  address: string;
}

export interface IMail {
  to: string | IMailAddress;
  cc?: Array<string | IMailAddress>;
  bcc?: Array<string | IMailAddress>;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailerService implements OnModuleInit {
  private transactionEmailSender: string;
  private readonly logger = new Logger(MailerService.name);

  constructor(
    @InjectEmailTemplateModel() private templateModel: EmailTemplateModel,
    private readonly nodemailer: NodeMailerService
  ) {}

  async onModuleInit() {
    this.transactionEmailSender = process.env['TRANSACTIONAL_EMAIL_SENDER'];
    if (!this.transactionEmailSender) {
      throw new Error('Missing TRANSACTIONAL_EMAIL_SENDER environment variable!');
    }

    if (!(await this.templateModel.findOne({ event: EmailEvent.OTP }))) {
      await this.templateModel.create({
        event: EmailEvent.OTP,
        subject: 'OTP for your account',
        text: 'Your OTP is {{otp}}',
        html: '<html><body>Your OTP is {{otp}}</body></html>',
      });
    }
  }

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    this.logger.debug({ msg: 'Sending otp email', email, otp });

    const template = await this.templateModel.findOne({ event: EmailEvent.OTP });

    const data = { email, otp };
    const html = await this.compileTemplate(template.html, data);
    const text = await this.compileTemplate(template.text, data);
    const subject = await this.compileTemplate(template.text, data);

    return this.sendMail({ to: email, html, text, subject });
  }

  private async sendMail(mail: IMail): Promise<void> {
    this.logger.debug({ msg: 'Sending email', mail: { ...mail, html: '...' } });
    try {
      await this.nodemailer.sendMail({
        from: this.transactionEmailSender,
        to: mail.to,
        cc: mail.cc,
        bcc: mail.bcc,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
    } catch (error) {
      this.logger.error(`Error on sending email. ${error.message}`, error.stack);
      throw error;
    }
  }

  private async compileTemplate(content: string, data: Record<string, unknown>): Promise<string> {
    try {
      const template = compile(content);
      return template(data);
    } catch (error) {
      this.logger.error(`Error compiling template: ${error.message}`, error.stack);
      throw error;
    }
  }
}
