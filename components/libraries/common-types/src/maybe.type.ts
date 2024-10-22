import { Nullable } from './nullable.type';
import { Optional } from './optional.type';

/**
 * Represents a type that can either be `Nullable` or `Optional`.
 *
 *
 * @template T - The type of the value that can be either `Nullable` or `Optional`.
 */
export type Maybe<T> = Nullable<T> | Optional<T>;
