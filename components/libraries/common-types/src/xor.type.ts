/**
 * Represents a type that allows either `T` or `U`, but not both.
 *
 * This utility type ensures that if `T` and `U` are both objects,
 * the resulting type will have properties from either `T` or `U`,
 * but not a mix of both. If `T` is an object, it will exclude
 * properties from `U` to avoid conflicts.
 *
 *
 * @template T - The first type.
 * @template U - The second type.
 */
export type XOR<T, U> = T | U extends object
  ? T extends object
    ? { [P in Exclude<keyof T, keyof U>]?: never } & U
    : T
  : T | U;
