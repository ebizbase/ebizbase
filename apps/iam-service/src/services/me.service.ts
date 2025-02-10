import { IRestfulResponse } from '@ebizbase/common-types';
import { Injectable } from '@nestjs/common';
import { MeBasicInfoOutputDto } from '../dtos/me/me-basic-info-output.dtos';
import { InjectUserModel, UserModel } from '../schemas/user.schema';

@Injectable()
export class MeService {
  constructor(@InjectUserModel() private userModel: UserModel) {}

  async get(userId: string): Promise<IRestfulResponse<MeBasicInfoOutputDto>> {
    return { data: await this.userModel.findById(userId) };
  }
}
