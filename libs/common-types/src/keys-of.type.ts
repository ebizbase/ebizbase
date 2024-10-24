/**
 * A utility type that extracts the keys of a given type `T`.
 *
 *
 * @template T - The type from which to extract the keys.
 */
export type KeysOf<T> = keyof T;
