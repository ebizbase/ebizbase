/**
 * Represents a function type where the parameters are partially applied.
 *
 *
 * @template T - A function type whose parameters will be partially applied.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialFunction<T extends (...args: any[]) => any> = (
  ...args: Partial<Parameters<T>>
) => ReturnType<T>;
