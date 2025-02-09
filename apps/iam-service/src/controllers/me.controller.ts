import { IRestfulResponse } from '@ebizbase/common-types';
import {
  Controller,
  Get,
  HttpCode,
  Logger,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SerializeInterceptor } from '../common/serialize.interceptor';
import { MeBasicInfoOutputDto } from '../dtos/me/me-basic-info-output.dtos';
import { OutPutDto } from '../dtos/output.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { MeService } from '../services/me.service';

@Controller('me')
@UseGuards(AccessTokenGuard)
export class MeController {
  private logger = new Logger(MeController.name);

  constructor(private meService: MeService) {}

  @Get('')
  @HttpCode(200)
  @UseInterceptors(new SerializeInterceptor(OutPutDto))
  async getOtp(
    @Request() { userId }: { userId: string }
  ): Promise<IRestfulResponse<MeBasicInfoOutputDto>> {
    this.logger.debug({ msg: 'Get me infomration', userId });
    return this.meService.get(userId);
  }
}
