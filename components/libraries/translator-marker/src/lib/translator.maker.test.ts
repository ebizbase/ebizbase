import { marker } from './translator.maker';

describe('marker', () => {
  it('should return the input string unchanged', () => {
    const input = 'Hello, World!';
    const result = marker(input, 'default', 'description');
    expect(result).toBe(input);
  });

  it('should ignore the _defaultValue parameter', () => {
    const input = 'Test String';
    const result = marker(input, 'ignored default', 'description');
    expect(result).toBe(input);
  });

  it('should ignore the _description parameter', () => {
    const input = 'Another Test String';
    const result = marker(input, 'default', 'ignored description');
    expect(result).toBe(input);
  });

  it('should ignore the _arguments parameter', () => {
    const input = 'String with arguments';
    const result = marker(input, 'default', 'description', { key: 'value' });
    expect(result).toBe(input);
  });
});
