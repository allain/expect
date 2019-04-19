import * as matchers from "./matchers.ts";

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

interface Expected {
  toBe(candidate: any, msg?: string): void;
  toEqual(candidate: any, msg?: string): void;
  toBeTruthy(msg?: string): void;
  toBeFalsy(msg?: string): void;
  toBeDefined(msg?: string): void;
  toBeInstanceOf(clazz: any, msg?: string): void;
  toBeUndefined(msg?: string): void;
  toBeNull(msg?: string): void;
  toBeNaN(msg?: string): void;
  toMatch(pattern: RegExp | string): void;
  toHaveProperty(propName: string, msg?: string): void;
  toHaveLength(length: number, msg?: string): void;
  toContain(item: any, msg?: string): void;
  toThrow(error?: RegExp | string, msg?: string): void;

  // comparison
  toBeGreaterThan(number: number, msg?: string): void;
  toBeGreaterThanOrEqual(number: number, msg?: string): void;
  toBeLessThan(number: number, msg?: string): void;
  toBeLessThanOrEqual(number: number, msg?: string): void;

  not: Expected;
  resolves: Expected;
  rejects: Expected;
}

export function expect(value: any): Expected {
  let isNot = false;
  let promised = false;
  const self = new Proxy(
    {},
    {
      get(_, name) {
        if (name === "not") {
          isNot = !isNot;
          return self;
        }

        if (name === "resolves") {
          if (!(value instanceof Promise))
            throw new AssertionError("expected value must be a Promise");

          promised = true;
          return self;
        }

        if (name === "rejects") {
          if (!(value instanceof Promise))
            throw new AssertionError("expected value must be a Promise");

          value = value.then(
            value => {
              throw new AssertionError(
                `Promise did not reject. resolved to ${value}`
              );
            },
            err => err
          );
          promised = true;
          return self;
        }

        const matcher = matchers[name];
        if (matcher) {
          return (...args) => {
            function applyMatcher(value, args) {
              if (isNot) {
                let thrown = null;
                try {
                  matcher(value, ...args);
                } catch (err) {
                  thrown = err;
                }
                if (thrown) {
                  if (!(thrown instanceof AssertionError)) throw thrown;
                } else {
                  throw new AssertionError("expected it to not");
                }
              } else {
                matcher(value, ...args);
              }
            }

            return promised
              ? value.then(value => applyMatcher(value, args))
              : applyMatcher(value, args);
          };
        }
      }
    }
  );

  return self;
}
