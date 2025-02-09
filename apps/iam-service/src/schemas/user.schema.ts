import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument, Model } from 'mongoose';
import speakeasy from 'speakeasy';

const generateRandomUserName = (): string => {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';

  const firstChar = upperChars.charAt(Math.floor(Math.random() * upperChars.length));
  let randomStr = '';

  for (let i = 0; i < 5; i++) {
    randomStr += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
  }

  return `User ${firstChar}${randomStr}`;
};

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar?: string;

  @Prop({ default: generateRandomUserName })
  name: string;

  @Exclude()
  @Prop({ default: () => speakeasy.generateSecret().base32 })
  otpSecret: string;

  @Exclude()
  @Prop({ default: 0 })
  otpCounter: number;

  @Exclude()
  @Prop({ default: false })
  otpUsed: boolean;

  @Exclude()
  @Prop({ default: () => new Date() })
  otpIssuedAt: Date;
}

export const InjectUserModel = () => InjectModel(User.name);
export type UserModel = Model<User>;
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
