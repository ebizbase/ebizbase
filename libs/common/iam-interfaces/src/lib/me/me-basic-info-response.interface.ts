import { ColorMode, Language } from '@ebizbase/common-types';

export interface IMeBasicInfoResponse {
  email: string;
  name: string;
  avatar?: string;
  colorMode: ColorMode;
  language: Language;
}
