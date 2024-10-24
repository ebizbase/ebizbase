import { EliteLogger } from '@ebizbase/nest-elite-logger';
import { OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language } from '../schemas/language';
import { GrpcUnavailableException } from '@ebizbase/nest-grpc-exceptions';
import { Metadata } from '@grpc/grpc-js';

const LANGUAGES = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Shqip' },
  { code: 'ar', name: 'العربية' },
  { code: 'hy', name: 'Հայերեն' },
  { code: 'az', name: 'Azərbaycan' },
  { code: 'eu', name: 'Euskara' },
  { code: 'be', name: 'Беларуская' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'bs', name: 'Bosanski' },
  { code: 'ca', name: 'Català' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'cs', name: 'Čeština' },
  { code: 'da', name: 'Dansk' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Eesti' },
  { code: 'tl', name: 'Filipino' },
  { code: 'fi', name: 'Suomi' },
  { code: 'fr', name: 'Français' },
  { code: 'gl', name: 'Galego' },
  { code: 'ka', name: 'ქართული' },
  { code: 'de', name: 'Deutsch' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'ht', name: 'Kreyòl ayisyen' },
  { code: 'ha', name: 'Hausa' },
  { code: 'he', name: 'עברית' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'hu', name: 'Magyar' },
  { code: 'is', name: 'Íslenska' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'jw', name: 'Jawa' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'kk', name: 'Қазақ' },
  { code: 'km', name: 'ខ្មែរ' },
  { code: 'ko', name: '한국어' },
  { code: 'ku', name: 'Kurdî' },
  { code: 'ky', name: 'Кыргыз' },
  { code: 'lo', name: 'ລາວ' },
  { code: 'la', name: 'Latina' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'lb', name: 'Lëtzebuergesch' },
  { code: 'mk', name: 'Македонски' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mt', name: 'Malti' },
  { code: 'mi', name: 'Māori' },
  { code: 'mr', name: 'मराठी' },
  { code: 'mn', name: 'Монгол' },
  { code: 'my', name: 'မြန်မာ' },
  { code: 'ne', name: 'नेपाली' },
  { code: 'no', name: 'Norsk' },
  { code: 'ny', name: 'Chichewa' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
  { code: 'ps', name: 'پښتو' },
  { code: 'fa', name: 'فارسی' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ro', name: 'Română' },
  { code: 'ru', name: 'Русский' },
  { code: 'sr', name: 'Српски' },
  { code: 'si', name: 'සිංහල' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'so', name: 'Soomaaliga' },
  { code: 'es', name: 'Español' },
  { code: 'su', name: 'Sunda' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'sv', name: 'Svenska' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'th', name: 'ไทย' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'uk', name: 'Українська' },
  { code: 'ur', name: 'اردو' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'cy', name: 'Cymraeg' },
  { code: 'xh', name: 'isiXhosa' },
  { code: 'yi', name: 'יידיש' },
  { code: 'zu', name: 'isiZulu' },
];

export class LanguageService implements OnModuleInit {
  private logger = new EliteLogger(LanguageService.name);

  constructor(@InjectModel(Language.name) private languageModel: Model<Language>) {}

  async onModuleInit() {
    this.logger.debug('Initializing language module');
    this.logger.debug('Ensuring indexes for language model');
    await this.languageModel.ensureIndexes();

    this.logger.debug('Checking system languages');
    const count = await this.languageModel.countDocuments();
    this.logger.debug('Total system languages %s', count);
    if (count == 0) {
      this.logger.debug('No language found, seeding default languages');
      await this.seedingLanguages();
    }
  }

  async seedingLanguages() {
    this.logger.info('Seeding default languages');
    const mainSupportLanguages = [
      { code: 'en', name: 'English', isDefault: true, isActive: true },
      { code: 'vi', name: 'Tiếng Việt', isDefault: false, isActive: true },
    ];
    const otherLanguages = LANGUAGES.filter(
      (language) => language.code !== 'en' && language.code !== 'vi'
    ).map(({ code, name }) => ({ code, name, isDefault: false }));
    this.logger.debug('Inserting languages');
    await this.languageModel.insertMany([...mainSupportLanguages, ...otherLanguages]);
    this.logger.info('Seeding default languages completed');
  }

  async getActiveLanguages(metadata: Metadata): Promise<Language[]> {
    this.logger.trace('Getting active languages');
    try {
      const results = await this.languageModel.find({ isActive: true }).exec();
      return results.map((result) => result.toObject());
    } catch (error) {
      if (error.code === 10061 || error.code === 10058 || error.code === 18) {
        metadata.add(
          'error',
          'We are having trouble connecting to the database. Our technical team is working to resolve this issue. Please try again in approximately 5 minutes. Thank you for your patience!'
        );
        throw new GrpcUnavailableException(error.message, metadata);
      } else {
        throw error;
      }
    }
  }
}
