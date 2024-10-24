/**
 * Represents an object with no properties.
 *
 * This type is useful when you need to explicitly define an empty object
 * in your type definitions.
 *
 * @example
 * // Valid usage:
 * const obj: EmptyObject = {};
 *
 * @example
 * // Invalid usage:
 * const obj: EmptyObject = { key: 'value' }; // Error: Type '{ key: string; }' is not assignable to type 'EmptyObject'.
 */
export type EmptyObject = Record<string, never>;
