import { MongoModule } from '@ebizbase/nestjs-mongodb';
import { NodeMailerModule } from '@ebizbase/nestjs-node-mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Session } from 'inspector/promises';
import { AuthenticateController } from './controllers/authenticate.controller';
import { HealthyController } from './controllers/healthy.controller';
import { MeController } from './controllers/me.controller';
import { EmailTemplate, EmailTemplateSchema } from './schemas/email-template.schema';
import { SessionSchema } from './schemas/session.schema';
import { User, UserSchema } from './schemas/user.schema';
import { AuthenticateService } from './services/authenticate.service';
import { HealthyService } from './services/healthy.service';
import { MailerService } from './services/mailer.service';
import { MeService } from './services/me.service';

@Module({
  imports: [
    MongoModule.register('iam-service'),
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
    NodeMailerModule.register(),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret = process.env['TOKEN_SECRET'];
        if (!secret) {
          throw new Error('Missing TOKEN_SECRET environment variable');
        }
        return {
          secret: process.env['TOKEN_SECRET'],
        };
      },
    }),
  ],
  controllers: [HealthyController, AuthenticateController, MeController],
  providers: [HealthyService, AuthenticateService, MeService, MailerService],
})
export class MainModule {}
