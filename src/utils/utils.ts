export function identity<T>(x: T): T {
  return x;
}

export function noop(): void {
  // do nothing
}

export function getElementsInBetween<T>(
  arr: T[],
  element1: T,
  element2: T
): T[] {
  const index1 = arr.indexOf(element1);
  const index2 = arr.indexOf(element2);
  if (index1 >= 0 && index2 >= 0) {
    const inBetween = arr.slice(
      Math.min(index1, index2) + 1,
      Math.max(index1, index2)
    );
    if (index1 > index2) inBetween.reverse();
    return inBetween;
  }
  throw Error('Element not found');
}

export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  if (arr1.length == arr2.length)
    return arr1.map((val, index) => [val, arr2[index]]);
  throw Error('Zip arrays must be of matching length');
}

export function removeItemFromArray<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item);
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export function getFirstFractionOfArray<T>(arr: T[], fraction: number): T[] {
  const endPoint = Math.floor((arr.length * (fraction - 1)) / fraction);
  return arr.slice(0, endPoint);
}

export function binaryMap<T, U, V>(f: (T, U) => V, arr: [T, U][]): V[] {
  return arr.map((elem) => f(elem[0], elem[1]));
}

export function constructClass<T>(
  cls: { new (...args: unknown[]): T },
  ...args: unknown[]
): T {
  return new cls(...args);
}
