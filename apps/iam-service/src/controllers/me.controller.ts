import { IRestfulResponse } from '@ebizbase/common-types';
import { Body, Controller, Get, HttpCode, Logger, Patch, Request, UseGuards } from '@nestjs/common';
import { MeInputDto } from '../dtos/me/me-input.dtos';
import { MeOutputDto } from '../dtos/me/me-output.dtos';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { MeService } from '../services/me.service';

@Controller('me')
@UseGuards(AccessTokenGuard)
export class MeController {
  private logger = new Logger(MeController.name);

  constructor(private meService: MeService) {}

  @Get('')
  @HttpCode(200)
  async getOtp(@Request() { userId }: { userId: string }): Promise<IRestfulResponse<MeOutputDto>> {
    this.logger.debug({ msg: 'Get me infomration', userId });
    return this.meService.get(userId);
  }

  @Patch('')
  @HttpCode(200)
  async update(
    @Body() body: MeInputDto,
    @Request() { userId }: { userId: string }
  ): Promise<IRestfulResponse<MeOutputDto>> {
    this.logger.debug({ msg: 'Verify identity', body });
    return this.meService.update(userId, body);
  }
}
