import * as matchers from "./matchers.ts";
import { AssertionError } from "https://deno.land/std/testing/asserts.ts";

export interface Expected {
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
  toBeGreaterThan(number: number, msg?: string): void;
  toBeGreaterThanOrEqual(number: number, msg?: string): void;
  toBeLessThan(number: number, msg?: string): void;
  toBeLessThanOrEqual(number: number, msg?: string): void;
  toHaveBeenCalled(msg?: string): void;
  toHaveBeenCalledTimes(number: number, msg?: string): void;
  toHaveBeenCalledWith(args: any[], msg?: string): void;
  toHaveBeenLastCalledWith(args: any[], msg?: string): void;
  toHaveBeenNthCalledWith(nthCall: number, args: any[], msg?: string): void;
  toHaveReturned(msg?: string): void;
  toHaveReturnedTimes(number: number, msg?: string): void;
  toHaveReturnedWith(value: any, msg?: string): void;
  toHaveLastReturnedWith(value: any, msg?: string): void;
  toHaveNthReturnedWith(nthCall: number, value: any, msg?: string): void;

  not: Expected;
  resolves: Expected;
  rejects: Expected;
}

export function expect(value: any): Expected {
  let isNot = false;
  let isPromised = false;
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

          isPromised = true;
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
          isPromised = true;
          return self;
        }

        const matcher = matchers[name];
        if (!matcher)
          throw new TypeError(typeof name === 'string' ? `Matcher not found: ${name}` : 'Matcher not found')

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

          return isPromised
            ? value.then(value => applyMatcher(value, args))
            : applyMatcher(value, args);
        };
      }
    }
  );

  return self;
}
