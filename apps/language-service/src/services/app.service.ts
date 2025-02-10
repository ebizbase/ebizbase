import { IRestfulResponse } from '@ebizbase/common-types';
import { Injectable } from '@nestjs/common';
import { InjectLanguageModel, LanguageModel, LanguageStatus } from '../schemas/language.schema';

@Injectable()
export class AppService {
  constructor(@InjectLanguageModel() private userModel: LanguageModel) {}

  async getActiveLanguages(): Promise<IRestfulResponse<string[]>> {
    const activeLanguages = await this.userModel.find({ status: LanguageStatus.active });
    return { data: activeLanguages.map((lang) => lang.code) };
  }
}
