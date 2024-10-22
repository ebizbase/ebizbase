/**
 * Represents a value that can be either of type `T` or a `Promise` that resolves to `T`.
 *
 * Useful for functions that return a value synchronously or asynchronously.
 *
 * @template T - The type of the value.
 */
export type Awaitable<T> = T | Promise<T>;
