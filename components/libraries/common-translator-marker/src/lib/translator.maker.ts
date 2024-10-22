/**
 * A marker function that returns the input string unchanged.
 * This function can be used to mark strings for translation purposes.
 *
 * @param string - The input string to be marked.
 * @param _defaultValue
 * @param _description - A description of the marked string.
 * @param _arguments
 * @returns The same input string.
 */
export function marker(
  string: string,
  _defaultValue: string,
  _description: string,
  _arguments?: object
): string {
  return string;
}
