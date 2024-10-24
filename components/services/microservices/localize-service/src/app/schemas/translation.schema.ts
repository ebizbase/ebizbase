import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, optimisticConcurrency: true })
export class Translation {
  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  key: string;

  @Prop({ default: false })
  humandVerify: boolean;

  @Prop({})
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
TranslationSchema.index(
  { service: 'asc', language: 'asc', key: 'asc', deletedAt: 'asc' },
  { name: 'translation-unique', unique: true, background: true }
);
