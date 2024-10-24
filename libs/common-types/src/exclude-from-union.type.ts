/**
 * ExcludeFromUnion is a utility type that removes types from a union.
 *
 *
 * @template T - The union type from which to exclude types.
 * @template U - The types to exclude from the union.
 *
 * @example
 * type Result = ExcludeFromUnion<'a' | 'b' | 'c', 'a'>; // Result is 'b' | 'c'
 */
export type ExcludeFromUnion<T, U> = T extends U ? never : T;
