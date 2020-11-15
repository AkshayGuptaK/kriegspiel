export function monoid<T>(
  operation: (prev: T, curr: T) => T,
  identity: T
): (...args: T[]) => T {
  return (...args: T[]) => args.reduce(operation, identity);
}

export const any = monoid((a, b) => a || b, false);
export const all = monoid((a, b) => a && b, true);

export const compose = <T, U, V>(f: (y: U) => V, g: (x: T) => U) => (x: T): V =>
  f(g(x));

// i have a fn which takes one move and returns boolean, i want a fn which takes many moves and returns boolean

export interface Functor<T> {
  map(fn: (val: T) => unknown): unknown;
}
