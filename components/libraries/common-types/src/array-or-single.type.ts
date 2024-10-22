/**
 * A type that represents either a single instance of a type `T` or an array of instances of type `T`.
 *
 *
 * @template T - The type of the elements.
 */
export type ArrayOrSingle<T> = T | T[];
