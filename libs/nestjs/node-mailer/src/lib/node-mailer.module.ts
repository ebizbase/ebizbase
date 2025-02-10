import { DynamicModule, Module } from '@nestjs/common';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import url from 'url';
import { NodeMailerService } from './node-mailer.service';

@Module({})
export class NodeMailerModule {
  private static parseSearchParams(searchParams: URLSearchParams): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  public static register(): DynamicModule {
    const smtpUri = process.env['SMTP_URI'];

    if (!smtpUri) {
      throw new Error('SMTP_URI is required');
    }

    let smtpUrl: URL;
    try {
      smtpUrl = new url.URL(smtpUri); // Kiểm tra URI có hợp lệ không
    } catch {
      throw new Error('SMTP_URI must be a valid URI');
    }

    const configs: SMTPPool.Options = {
      pool: true,
      host: smtpUrl.hostname,
      port: smtpUrl.port ? parseInt(smtpUrl.port) : 587,
      secure: smtpUrl.protocol === 'smtps:', // Sử dụng `smtps:` để kiểm tra TLS
      auth:
        smtpUrl.username && smtpUrl.password
          ? {
              user: decodeURIComponent(smtpUrl.username),
              pass: decodeURIComponent(smtpUrl.password),
            }
          : undefined,
      maxConnections: 5, // default max connections is 5
      maxMessages: 100, // default max messages is 100
      rateDelta: 1000, // default rate delta is 1000
      rateLimit: 10, // default rate limit is 10 messages per rateDelta (1s)
      ...this.parseSearchParams(smtpUrl.searchParams), // Chuyển searchParams thành object
    };

    return {
      module: NodeMailerModule,
      global: true,
      providers: [
        {
          provide: NodeMailerService,
          useValue: new NodeMailerService(configs),
        },
      ],
      exports: [NodeMailerService],
    };
  }
}
