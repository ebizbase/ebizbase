import { IRestfulResponse } from '@ebizbase/common-types';
import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthyService } from '../services/healthy.service';

@Controller('healthy')
export class HealthyController {
  constructor(private healthy: HealthyService) {}

  @Get('')
  async generalStat(): Promise<IRestfulResponse> {
    return this.healthy.healthCheck();
  }

  @Get('liveness')
  async liveness(): Promise<void> {
    this.healthy.healthCheck();
  }

  @Get('readiness')
  async readiness(): Promise<void> {
    const { data } = await this.healthy.healthCheck();
    if (!data['readiness']) {
      throw new ServiceUnavailableException();
    }
  }
}
