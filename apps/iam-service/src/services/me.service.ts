import { IRestfulResponse } from '@ebizbase/common-types';
import { Injectable } from '@nestjs/common';
import { MeInputDto } from '../dtos/me/me-input.dtos';
import { MeOutputDto } from '../dtos/me/me-output.dtos';
import { InjectUserModel, UserModel } from '../schemas/user.schema';

@Injectable()
export class MeService {
  constructor(@InjectUserModel() private userModel: UserModel) {}

  async get(userId: string): Promise<IRestfulResponse<MeOutputDto>> {
    return { data: await this.userModel.findById(userId) };
  }

  async update(userId: string, data: MeInputDto): Promise<IRestfulResponse<MeOutputDto>> {
    return { data: await this.userModel.findByIdAndUpdate(userId, data, { new: true }) };
  }
}
