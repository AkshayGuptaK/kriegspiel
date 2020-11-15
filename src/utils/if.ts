import { Either, Left, Right } from './either';
import { any, Functor } from './fp-utils';

export const ifContinueElseError = <T, U extends Functor<T>>(
  predicateFn: (vals: T) => boolean,
  err: unknown
) => (functor: U): Either => {
  if (functor.map(predicateFn)) return new Right(functor);
  return new Left(err);
};

export const ifContinueElseDo = <T, U extends Functor<T>>(
  predicateFn: (vals: T) => boolean,
  fn: (vals: T) => Either
) => (functor: U): Either => {
  if (functor.map(predicateFn)) return new Right(functor);
  return functor.map(fn) as Either;
};

export const ifAnyDoElseError = <T, U extends Functor<T>>(
  mappingFns: ((val: T) => T | null)[],
  err: unknown
) => (functor: U): Either => {
  const result = any(...(mappingFns.map(functor.map) as boolean[]));
  if (result) return new Right(result);
  return new Left(err);
};
