import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export enum LanguageStatus {
  active,
  prepare,
  inactive,
}

@Schema({})
export class Language {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, enum: LanguageStatus, type: Number })
  status: LanguageStatus;
}

export const InjectLanguageModel = () => InjectModel(Language.name);
export type LanguageModel = Model<Language>;
export type LanguageDocument = HydratedDocument<Language>;
export const LanguageSchema = SchemaFactory.createForClass(Language);
