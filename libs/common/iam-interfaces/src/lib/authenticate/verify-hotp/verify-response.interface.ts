import { IMeResponse } from '../../me';

export interface IVerifyHotpResponse extends IMeResponse {
  accessToken: string;
  refreshToken: string;
}
