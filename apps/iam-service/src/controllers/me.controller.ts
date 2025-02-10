import { IRestfulResponse } from '@ebizbase/common-types';
import { SerializeInterceptor } from '@ebizbase/nestjs-serial';
import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MeBasicInfoOutputDto } from '../dtos/me/me-basic-info-output.dtos';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { MeService } from '../services/me.service';

@Controller('me')
@UseGuards(AccessTokenGuard)
export class MeController {
  private logger = new Logger(MeController.name);

  constructor(private meService: MeService) {}

  @Get('')
  @HttpCode(200)
  @UseInterceptors(new SerializeInterceptor(MeBasicInfoOutputDto))
  async getOtp(
    @Request() { userId }: { userId: string }
  ): Promise<IRestfulResponse<MeBasicInfoOutputDto>> {
    this.logger.debug({ msg: 'Get me infomration', userId });
    return this.meService.get(userId);
  }
}
