/**
 * A utility type that makes all properties in `T` optional, except for the properties specified in `K` which remain required.
 *
 * @template T - The type to be partially made optional.
 * @template K - The keys of `T` that should remain required.
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;
