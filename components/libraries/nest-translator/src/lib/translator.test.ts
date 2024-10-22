import { Translator } from './translator';

class TestTranslator extends Translator {
  public translate(
    key: string,
    lang: string | undefined,
    defaultValue: string,
    description?: string,
    interpolateParams?: object
  ): string {
    return '';
  }

  public testInterpolate(string: string, interpolateParams: object): string {
    return this.interpolate(string, interpolateParams);
  }
}

describe('Translator', () => {
  let translator: TestTranslator;

  beforeEach(() => {
    translator = new TestTranslator();
  });

  it('should interpolate string with given parameters', () => {
    const result = translator.testInterpolate('Hello, {{ name }}!', { name: 'World' });
    expect(result).toBe('Hello, World!');
  });

  it('should leave placeholders intact if parameters are missing', () => {
    const result = translator.testInterpolate('Hello, {{ name }}!', {});
    expect(result).toBe('Hello, {{ name }}!');
  });

  it('should replace multiple placeholders', () => {
    const result = translator.testInterpolate('Hello, {{ name }}! You have {{ count }} messages.', {
      name: 'Alice',
      count: 5,
    });
    expect(result).toBe('Hello, Alice! You have 5 messages.');
  });

  it('should handle non-string and non-number values gracefully', () => {
    const result = translator.testInterpolate('Value: {{ value }}', { value: null });
    expect(result).toBe('Value: {{ value }}');
  });

  it('should handle extra spaces within placeholders', () => {
    const result = translator.testInterpolate('Hello, {{  name  }}!', { name: 'World' });
    expect(result).toBe('Hello, World!');
  });
});
