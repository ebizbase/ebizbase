/**
 * Represents a dictionary where keys are strings and values are of type `T`.
 *
 * @template T - The type of the values in the dictionary.
 */
export type Dict<T> = { [key: string]: T };
