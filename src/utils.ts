export function identity<T>(x: T): T {
  return x;
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
  return arr.splice(arr.indexOf(item), 1);
}
