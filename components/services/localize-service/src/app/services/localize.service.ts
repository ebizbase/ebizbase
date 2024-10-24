import { EliteLogger } from '@ebizbase/nest-elite-logger';
import { OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Language } from '../schemas/language';
import { GrpcNotFoundException, GrpcUnavailableException } from '@ebizbase/nest-grpc-exceptions';
import { Metadata } from '@grpc/grpc-js';
import { common, localize } from '../../protobuf';
import { Translation } from '../schemas/translation.schema';

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

  constructor(
    @InjectModel(Language.name) private languageModel: Model<Language>,
    @InjectModel(Translation.name) private translationModel: Model<Translation>,
    @InjectConnection() private readonly connection: Connection
  ) {

  }

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
    await this.languageModel.insertMany(LANGUAGES.map(language => {
      if (language.code === 'en') {
        return { ...language, isDefault: true }
      } else {
        return language;
      }
    }));
    this.logger.info('Seeding default languages completed');
  }

  async getLanguages(data: common.Listing, metadata: Metadata): Promise<Language[]> {
    try {
      const results = await this.languageModel.find().exec();
      return results.map((result) => result.toObject());
    } catch (error) {
      if (error.code === 10061 || error.code === 10058 || error.code === 18) {
        this.throwGrpcUnavailableException(error, metadata);
      } else {
        throw error;
      }
    }
  }

  async changeDefaultLanguage(id: string, metadata: Metadata): Promise<void> {
    let session: ClientSession;
    try {
      const language = await this.languageModel.findById(id).exec();
      if (!language) {
        metadata.add('error', `Language not found (ID: ${id})`);
        throw (new GrpcNotFoundException('Language not found', metadata));
      }
      session = await this.connection.startSession();
      session.startTransaction();
      await this.languageModel.updateMany({}, { isDefault: false }, { session });
      language.isDefault = true;
      await language.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      if (session) {
        session.endSession();  // Đảm bảo session được đóng
      }
      if (error.code === 10061 || error.code === 10058 || error.code === 18) {
        this.throwGrpcUnavailableException(error, metadata);
      } else {
        throw error;
      }
    }
  }

  async updateTranslation(data: localize.UpdateTranslactionRequest, metadata: Metadata): Promise<void> {
    try {
      const { id, value } = data;
      const translation = await this.translationModel.findById(id).exec();
      if (!translation) {
        metadata.add('error', `Translation not found (ID: ${id})`);
        throw (new GrpcNotFoundException('Translation not found', metadata));
      } else {
        translation.value = value;
        await translation.save();
      }
    } catch (error) {
      if (error.code === 10061 || error.code === 10058 || error.code === 18) {
        this.throwGrpcUnavailableException(error, metadata);
      } else {
        throw error;
      }
    }
  }



  async listTranslations(data: common.Listing, metadata: Metadata): Promise<Translation[]> {
    try {
      let query = this.translationModel.find();
      if (data.singleFilter) {
        query = this.applySingleFilter(query, data.singleFilter);
      }
      if (data.compositeFilter) {
        query = this.applyCompositeFilter(query, data.compositeFilter);
      }
      if (data.paging) {
        query = this.applyPagination(query, data.paging);
      }
      if (data.sort) {
        query = this.applySorting(query, data.sort);
      }
      const translations = await query.exec();
      return translations;
    } catch (error) {
      if (error.code === 10061 || error.code === 10058 || error.code === 18) {
        this.throwGrpcUnavailableException(error, metadata);
      } else {
        throw error;
      }
    }
  }

  private applySingleFilter(query, filter: common.Filter) {
    // Xử lý arrayElementFilter
    if (filter.arrayElementFilter) {
      const { field, operator, value } = filter.arrayElementFilter;

      switch (operator) {
        case common.ArrayElementOperator.ARRAY_ELEMENT_OPERATOR_MATCH:
          query = query.elemMatch(field, { $in: value });
          break;
        case common.ArrayElementOperator.ARRAY_ELEMENT_OPERATOR_NOT_MATCH:
          query = query.elemMatch(field, { $nin: value });
          break;
        case common.ArrayElementOperator.ARRAY_ELEMENT_OPERATOR_COUNT:
          query = query.where(field).size(value.length);
          break;
        case common.ArrayElementOperator.ARRAY_ELEMENT_OPERATOR_REGEX:
          query = query.where(field).regex(value[0]);
          break;
        default:
          break;
      }
    }

    // Xử lý arrayFilter
    if (filter.arrayFilter) {
      const { field, operator, value } = filter.arrayFilter;

      switch (operator) {
        case common.ArrayOperator.ARRAY_OPERATOR_IN:
          query = query.where(field).in(value);
          break;
        case common.ArrayOperator.ARRAY_OPERATOR_NIN:
          query = query.where(field).nin(value);
          break;
        default:
          break;
      }
    }

    // Xử lý existenceFilter
    if (filter.existenceFilter) {
      const { field, operator } = filter.existenceFilter;

      switch (operator) {
        case common.ExistenceOperator.EXISTENCE_OPERATOR_EXISTS:
          query = query.where(field).exists(true);
          break;
        default:
          break;
      }
    }

    // Xử lý geoFilter
    if (filter.geoFilter) {
      const { field, operator, value } = filter.geoFilter;
      console.log('field', field);
      switch (operator) {
        case common.GeoOperator.GEO_OPERATOR_NEAR:
          if (value) {
            const { lat, lng, radius } = value;
            query = query.geoNear({
              near: { type: "Point", coordinates: [lng, lat] },
              maxDistance: radius,
              spherical: true,
            });
          }
          break;
        default:
          break;
      }
    }

    // Xử lý patternFilter
    if (filter.patternFilter) {
      const { field, operator, value } = filter.patternFilter;

      switch (operator) {
        case common.PatternOperator.PATTERN_OPERATOR_LIKE:
          query = query.where(field).regex(new RegExp(value, 'i')); // 'i' cho case-insensitive
          break;
        case common.PatternOperator.PATTERN_OPERATOR_REGEX:
          query = query.where(field).regex(value);
          break;
        default:
          break;
      }
    }

    // Xử lý rangeFilter
    if (filter.rangeFilter) {
      const { field, operator, value } = filter.rangeFilter;

      switch (operator) {
        case common.RangeOperator.RANGE_OPERATOR_BETWEEN:
          if (value.length === 2) {
            query = query.where(field).gte(value[0]).lte(value[1]);
          }
          break;
        default:
          break;
      }
    }

    // Xử lý comparisonFilter
    if (filter.comparisonFilter) {
      const { field, operator, stringValue, numberValue } = filter.comparisonFilter;

      switch (operator) {
        case common.ComparisonOperator.COMPARISON_OPERATOR_EQ:
          query = query.where(field).equals(stringValue || numberValue);
          break;
        case common.ComparisonOperator.COMPARISON_OPERATOR_NEQ:
          query = query.where(field).ne(stringValue || numberValue);
          break;
        case common.ComparisonOperator.COMPARISON_OPERATOR_GT:
          query = query.where(field).gt(numberValue);
          break;
        case common.ComparisonOperator.COMPARISON_OPERATOR_GTE:
          query = query.where(field).gte(numberValue);
          break;
        case common.ComparisonOperator.COMPARISON_OPERATOR_LT:
          query = query.where(field).lt(numberValue);
          break;
        case common.ComparisonOperator.COMPARISON_OPERATOR_LTE:
          query = query.where(field).lte(numberValue);
          break;
        default:
          break;
      }
    }

    return query;
  }


  private applyCompositeFilter(query, compositeFilter: common.CompositeFilter) {
    if (compositeFilter.operator) {
      query = query.or(compositeFilter.filters.map(filter => this.applySingleFilter(this.translationModel.find(), filter)));
    }
    return query;
  }

  private applyPagination(query, paging: common.Pagination) {
    if (paging.cursor) {
      query = query.where('_id').gt(paging.cursor.lastId);
    } else if (paging.offset) {
      const { page = 1, pageSize = 10 } = paging.offset;
      query = query.skip((page - 1) * pageSize).limit(pageSize);
    }
    return query;
  }

  private applySorting(query, sort: common.Sort) {
    if (sort.field && sort.direction !== undefined) {
      const direction = sort.direction === false ? 'desc' : 'asc';
      query = query.sort({ [sort.field]: direction });
    }
    return query;
  }

  private throwGrpcUnavailableException(error: Error, metadata: Metadata) {
    metadata.add(
      'error',
      'We are having trouble connecting to the database. Our technical team is working to resolve this issue. Please try again in approximately 5 minutes. Thank you for your patience!'
    );
    throw new GrpcUnavailableException(error.message, metadata);
  }
}
