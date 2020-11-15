abstract class Either {
  static of(val) {
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

  abstract map(fn: (val) => unknown);
  abstract unwrap(): unknown;
}

class Left<E> extends Either {
  constructor(private err: E) {
    super();
  }

  unwrap() {
    return this.err;
  }

  map(_fn: unknown) {
    return this;
  }
}

class Right<T> extends Either {
  constructor(private value: T) {
    super();
  }

  unwrap(): T {
    return this.value;
  }

  map(fn: (val: T) => T) {
    return new Right(fn(this.value));
  }
}

export const either = (val: unknown): Either => Either.of(val);
