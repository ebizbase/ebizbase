/**
 * Recursively makes all properties of a type optional.
 *
 * @template T - The type to be made deeply partial.
 */
export type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };
