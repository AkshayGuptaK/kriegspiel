export function getNextElementsOfArray<T>(
  next: number,
  arr: T[],
  element: T
): T[] {
  const index = arr.indexOf(element);
  if (index + next > arr.length)
    throw Error('Elements requested exceed array length');
  return arr.slice(index + 1, index + 1 + next);
}

export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  if (arr1.length !== arr2.length)
    throw Error('Zip arrays must be of matching length');
  return arr1.map((val, index) => [val, arr2[index]]);
}
