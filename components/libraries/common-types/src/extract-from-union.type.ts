/**
 * Extracts types from a union that are assignable to a given type.
 *
 *
 * @template T - The union type to extract from.
 * @template U - The type to extract.
 * @returns A type that includes only the types from T that are assignable to U.
 */
export type ExtractFromUnion<T, U> = T extends U ? T : never;
