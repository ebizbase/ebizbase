/**
 * Represents a type that can either be of type `T` or `undefined`.
 *
 * This is useful for cases where a value may or may not be present.
 *
 *
 * @template T - The type of the value that may be present.
 */
export type Optional<T> = T | undefined;
