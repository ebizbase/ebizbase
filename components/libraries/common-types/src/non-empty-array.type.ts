/**
 * Represents an array that is guaranteed to have at least one element.
 *
 *
 * @template T - The type of elements in the array.
 */
export type NonEmptyArray<T> = [T, ...T[]];
