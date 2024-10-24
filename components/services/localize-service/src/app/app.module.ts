import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from './schemas/language';
import { LanguageService } from './services/localize.service';
import { LocalizeController } from './controller/localize.controller';
import { Translation, TranslationSchema } from './schemas/translation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
      { name: Translation.name, schema: TranslationSchema }
    ])
  ],
  controllers: [LocalizeController],
  providers: [LanguageService],
})
export class AppModule { }
