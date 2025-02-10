import { ColorMode, Language } from '@ebizbase/common-types';

export interface IGetOtpRequest {
  email: string;
  language: keyof Language;
  colorMode: keyof ColorMode;
}
