import { AssertionError } from "https://deno.land/std/testing/asserts.ts";
import * as mock from './mock.ts'

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

function extractMockCalls(value: any, name: string): mock.MockCall[] {
  if (typeof value !== 'function') {
    throw new AssertionError(`${name} only works on mock functions. received: ${value}`)
  }
  const calls = mock.calls(value)
  if (calls === null) {
    throw new AssertionError(`${name} only works on mock functions`)
  }

  return calls
}

export function toHaveBeenCalled(value, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenCalled')
  if (calls.length === 0) {
    throw new AssertionError(msg || 'function not called')
  }
}

export function toHaveBeenCalledTimes(value: any, times: number, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenCalledTimes')
  if (calls.length !== times) {
    throw new AssertionError(msg || `expected ${times} calls but was called: ${calls.length}`)
  }
}

export function toHaveBeenCalledWith(value: any, args: any[], msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenCalledWith')
  const wasCalledWith = calls.some(c => same(c.args, args))
  if (!wasCalledWith) {
    throw new AssertionError(msg || `function not called with: ${args}`)
  }
}

export function toHaveBeenLastCalledWith(value: any, args: any[], msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenLastCalledWith')
  if (calls.length) {
    const lastCall = calls[calls.length - 1]
    if (!same(lastCall.args, args))
      throw new AssertionError(msg || `expect last call args to be ${args} but was: ${lastCall.args}`)
  } else {
    throw new AssertionError(msg || `function was not called. expected arguments: ${args}`)
  }
}

export function toHaveBeenNthCalledWith(value: any, nth: number, args: any[], msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenNthCalledWith')
  const nthCall = calls[nth - 1]
  if (nthCall) {
    if (!same(nthCall.args, args))
      throw new AssertionError(msg || `expect ${nth}th call args to be ${args} but was: ${nthCall.args}`)
  } else {
    throw new AssertionError(msg || `${nth}th call was not made.`)
  }
}

export function toHaveReturnedWith(value: any, result: any, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenNthCalledWith')
  const wasReturnedWith = calls.some(c => c.returns && same(c.returned, result))
  if (!wasReturnedWith) {
    throw new AssertionError(msg || `function did not return: ${result}`)
  }
}

export function toHaveReturned(value: any, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenCalledTimes')
  if (!calls.some(c => c.returns)) {
    throw new AssertionError(msg || `expected function to return but it never did`)
  }
}

export function toHaveLastReturnedWith(value: any, expected: any, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveBeenCalledTimes')
  const lastCall = calls[calls.length - 1]
  if (!lastCall) {
    throw new AssertionError(msg || 'no calls made to function')
  }
  if (lastCall.throws) {
    throw new AssertionError(msg || `last call to function threw: ${lastCall.thrown}`)
  }

  if (!same(lastCall.returned, expected)) {
    throw new AssertionError(msg || `expected last call to return ${expected} but returned: ${lastCall.returned}`)
  }
}

export function toHaveReturnedTimes(value: any, times: number, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveReturnedTimes')
  const returnCount = calls.filter(c => c.returns).length
  if (returnCount !== times) {
    throw new AssertionError(msg || `expected ${times} returned times but returned ${returnCount} times`)
  }
}

export function toHaveNthReturnedWith(value: any, nth: number, expected: any, msg?: string) {
  const calls = extractMockCalls(value, 'toHaveNthReturnedWith')
  const nthCall = calls[nth - 1]
  if (!nthCall) {
    throw new AssertionError(msg || `${nth} calls were now made`)
  }

  if (nthCall.throws) {
    throw new AssertionError(msg || `${nth}th call to function threw: ${nthCall.thrown}`)
  }

  if (!same(nthCall.returned, expected)) {
    throw new AssertionError(msg || `expected ${nth}th call to return ${expected} but returned: ${nthCall.returned}`)
  }
}

