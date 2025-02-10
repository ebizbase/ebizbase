import { MongoModule } from '@ebizbase/nestjs-mongodb';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './controllers/app.controller';
import { HealthyController } from './controllers/healthy.controller';
import { Language, LanguageSchema } from './schemas/language.schema';
import { AppService } from './services/app.service';
import { HealthyService } from './services/healthy.service';

@Module({
  imports: [
    MongoModule.register('language-service'),
    MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }]),
  ],
  controllers: [HealthyController, AppController],
  providers: [HealthyService, AppService],
})
export class MainModule {}
