/**
 * Represents a type that transforms an object type `T` into a union of tuples,
 * where each tuple contains a key of `T` and its corresponding value.
 *
 *
 * @template T - The object type to be transformed.
 */
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
