import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export enum EmailEvent {
  OTP = 'otp',
}

@Schema({ collection: 'email-templates' })
export class EmailTemplate {
  @Prop({ required: true, unique: true, enum: EmailEvent })
  event: EmailEvent;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  html: string;
}

export const InjectEmailTemplateModel = () => InjectModel(EmailTemplate.name);
export type EmailTemplateModel = Model<EmailTemplate>;
export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;
export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
