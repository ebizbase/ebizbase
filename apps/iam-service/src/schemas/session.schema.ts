import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ versionKey: false })
export class Session {
  @Prop({ required: true })
  userId: string;

  @Prop()
  flatform: string;

  @Prop()
  browser: string;

  @Prop()
  device?: string;

  @Prop({ required: true, type: [{ ip: String, timestamp: { type: Date, default: Date.now } }] })
  ipHistory: Array<{ ip: string; timestamp: Date }>;

  @Prop({ required: true, default: () => Date.now() })
  createdAt: Date;

  @Prop({ required: true, index: { expireAfterSeconds: 0 } })
  expiredAt: Date;

  @Prop()
  revokedAt?: Date;
}

export const InjectSessionModel = () => InjectModel(Session.name);
export type SessionModel = Model<Session>;
export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);
