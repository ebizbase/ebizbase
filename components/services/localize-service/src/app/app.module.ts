import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from './schemas/language';
import { LanguageService } from './services/language.service';
import { LocalizeController } from './controller/localize.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }])],
  controllers: [LocalizeController],
  providers: [LanguageService],
})
export class AppModule {}
