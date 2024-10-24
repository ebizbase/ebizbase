/**
 * Recursively makes all properties of an object type `T` readonly.
 *
 * @template T - The object type to be made deeply readonly.
 *
 * @remarks
 * This type uses TypeScript's mapped and conditional types to traverse all properties of `T`.
 * If a property is an object, it applies `DeepReadonly` recursively.
 * Otherwise, it makes the property readonly.
 *
 * @example
 * ```typescript
 * interface Example {
 *   a: number;
 *   b: {
 *     c: string;
 *   };
 * }
 *
 * const example: DeepReadonly<Example> = {
 *   a: 1,
 *   b: {
 *     c: 'hello'
 *   }
 * };
 *
 * // The following lines will cause TypeScript compilation errors
 * // example.a = 2;
 * // example.b.c = 'world';
 * ```
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
