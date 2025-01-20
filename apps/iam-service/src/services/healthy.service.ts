import { Dict, IRestfulResponse } from '@ebizbase/common-types';
import { MongoService } from '@ebizbase/nestjs-mongo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthyService {
  constructor(private mongo: MongoService) {}

  async healthCheck(): Promise<IRestfulResponse<Dict<unknown>>> {
    const isMongoConnectionUp = await this.mongo.isConnectionUp();
    return {
      data: {
        liveness: true,
        readiness: isMongoConnectionUp,
        dependencies: {
          mongodb: isMongoConnectionUp ? 'up' : 'down',
        },
      },
    };
  }
}
