import autoBind from 'auto-bind';

export abstract class Either {
  static of(val: unknown): Right<unknown> {
    return new Right(val);
  }

  flatten(): Either {
    const val = this.unwrap();
    if (val instanceof Either) return val;
    return this;
  }

  chain(fn: (val) => Either): Either {
    return this.map(fn).flatten();
  }

  fold(g: (err: unknown) => unknown, f: (val: unknown) => unknown): unknown {
    if (this instanceof Left) {
      return g(this.unwrap());
    }
    return f(this.unwrap());
  }

  abstract map(fn: (val) => unknown): Either;
  abstract unwrap(): unknown;
}

export class Left<E> extends Either {
  constructor(private err: E) {
    super();
    autoBind(this);
  }

  unwrap(): E {
    return this.err;
  }

  map(_fn: unknown): Left<E> {
    return this;
  }
}

export class Right<T> extends Either {
  constructor(private value: T) {
    super();
    autoBind(this);
  }

  unwrap(): T {
    return this.value;
  }

  map(fn: (val: T) => T): Right<T> {
    return new Right(fn(this.value));
  }
}
