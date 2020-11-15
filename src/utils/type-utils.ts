export const literalArray = <T>() => <L extends T>(arr: L[]): L[] => arr;

export function isNotNullish<T>(x: T | null | undefined): x is T {
  return x != null;
}
