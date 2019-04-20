import { AssertionError } from "https://deno.land/std/testing/asserts.ts";

type MatcherState = {
  isNot: boolean;
};

export function toBe(value: any, candidate: any, msg?: string): void {
  if (value !== candidate) {
    throw new AssertionError(msg);
  }
}

export function toEqual(value: any, candidate: any, msg?: string): void {
  if (!same(value, candidate)) throw new AssertionError(msg);
}

export function toBeGreaterThan(
  value: any,
  number: number,
  msg?: string
): void {
  if (value <= number) throw new AssertionError(msg);
}

export function toBeLessThan(value: any, number: number, msg?: string): void {
  if (value >= number) throw new AssertionError(msg);
}

export function toBeGreaterThanOrEqual(
  value: any,
  number: number,
  msg?: string
): void {
  if (value < number) throw new AssertionError(msg);
}

export function toBeLessThanOrEqual(
  value: any,
  number: number,
  msg?: string
): void {
  if (value > number) throw new AssertionError(msg);
}

export function toBeTruthy(value: any, msg?: string): void {
  if (!value) throw new AssertionError(msg);
}

export function toBeFalsy(value: any, msg?: string): void {
  if (value) throw new AssertionError(msg);
}

export function toBeDefined(value: any, msg?: string): void {
  if (typeof value === "undefined") throw new AssertionError(msg);
}

export function toBeUndefined(value: any, msg?: string): void {
  if (typeof value !== "undefined") throw new AssertionError(msg);
}

export function toBeNull(value: any, msg?: string): void {
  if (value !== null) throw new AssertionError(msg);
}

export function toBeNaN(value: any, msg?: string): void {
  if (!isNaN(value)) throw new AssertionError(msg);
}

export function toBeInstanceOf(value: any, clazz, msg?: string): void {
  if (!(value instanceof clazz)) throw new AssertionError(msg);
}

export function toMatch(
  value: any,
  pattern: RegExp | string,
  msg?: string
): void {
  const valueStr = value.toString();
  if (typeof pattern === "string") {
    if (valueStr.indexOf(pattern) === -1) throw new AssertionError(msg);
  } else if (pattern instanceof RegExp) {
    if (!pattern.exec(valueStr)) throw new AssertionError(msg);
  }
}

export function toHaveProperty(
  value: any,
  propName: string,
  msg?: string
): void {
  if (!Object.keys(value || {}).includes(propName)) {
    throw new AssertionError(msg);
  }
}

export function toHaveLength(value: any, length: number, msg?: string): void {
  if ("length" in value && value.length !== length) {
    throw new AssertionError(msg);
  }
}

export function toContain(value: any, item: any, msg?: string): void {
  if (!Array.isArray(value))
    throw new AssertionError(`expect array but was ${value}`);

  if (!value.includes(item)) throw new AssertionError(msg);
}

export function toThrow(
  value: any,
  error?: RegExp | string,
  msg?: string
): void {
  if (typeof value === "function") {
    try {
      value = value();
    } catch (err) {
      value = err;
    }
  }

  if (!(value instanceof Error)) {
    throw new AssertionError(`expected Error but found ${value}`);
  }

  if (typeof error === "string") {
    if (!value.message.includes(error))
      throw new AssertionError(`expected error "${error}" but got: ${value}`);
  } else if (error instanceof RegExp) {
    if (!value.message.match(error))
      throw new AssertionError(`expected error /${error}/ but got: ${value}`);
  }
}

function same(a: any, b: any): boolean {
  if (a === b) return true;

  // Array Comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => same(val, b[index]));
  } else if (Array.isArray(a)) {
    return false;
  } else if (Array.isArray(b)) {
    return false;
  }

  // Object comparison
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return same(aKeys, bKeys) && aKeys.every(aKey => same(a[aKey], b[aKey]));
  }

  return a === b;
}
