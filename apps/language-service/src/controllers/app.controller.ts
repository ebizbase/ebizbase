import { IRestfulResponse } from '@ebizbase/common-types';
import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('')
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(private appService: AppService) {}

  @Get('')
  @HttpCode(200)
  async getOtp(): Promise<IRestfulResponse<Array<string>>> {
    this.logger.debug({ msg: 'Get all active languages' });
    return this.appService.getActiveLanguages();
  }
}
