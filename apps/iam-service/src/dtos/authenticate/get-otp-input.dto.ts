import { ColorMode, Language } from '@ebizbase/common-types';
import { IGetOtpRequest } from '@ebizbase/iam-interfaces';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class GetOtpInputDTO implements Omit<IGetOtpRequest, 'language' | 'colorMode'> {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => Language[value as keyof typeof Language])
  language: Language;

  @IsString()
  @Transform(({ value }) => ColorMode[value as keyof typeof ColorMode])
  colorMode: ColorMode;
}
