import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Language {
  @Prop({ required: true, unique: true, index: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({})
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
LanguageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
LanguageSchema.set('toObject', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});
