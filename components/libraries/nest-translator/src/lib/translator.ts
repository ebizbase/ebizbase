import { Optional } from '@ebizbase/common-types';

export abstract class Translator {
  public abstract translate(
    key: string,
    lang: Optional<string>,
    defaultValue: string,
    description?: string,
    interpolateParams?: object
  ): string;

  protected interpolate(str: string, interpolateParams: object): string {
    return str.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
      return interpolateParams[key] ? String(interpolateParams[key]) : match;
    });
  }
}
