import { runTests, test } from "https://deno.land/std/testing/mod.ts";
import {
  assert,
  assertEquals,
  assertThrows
} from "https://deno.land/std/testing/asserts.ts";
import { expect, AssertionError } from "./expect.ts";

async function assertAllPass(...fns) {
  for (let fn of fns) {
    try {
      assertEquals(await fn(), undefined);
    } catch (err) {
      throw new AssertionError(
        `expected ${fn.toString()} to pass but it failed with ${err}`
      );
    }
  }
}

async function assertAllFail(...fns) {
  for (let fn of fns) {
    try {
      let resolution = await fn();
      throw new AssertionError(
        `expected ${fn.toString()} to throw but it resolved with ${resolution}`
      );
    } catch (err) {
      // expected
    }
  }
}

test(function exportsFunction() {
  assertEquals(typeof expect, "function");
});

test(async function toBe() {
  const obj = {};
  assertAllPass(
    () => expect(obj).toBe(obj),
    () => expect(obj).not.toBe({}),
    () => expect(Promise.resolve(1)).resolves.toBe(1),
    () => expect(Promise.reject(1)).rejects.toBe(1)
  );

  assertAllFail(() => expect(obj).toBe({}), () => expect(obj).not.toBe(obj));
});

test(async function toEqual() {
  const obj = {};

  assertAllPass(
    () => expect(1).toEqual(1),
    () => expect(obj).toEqual({}),
    () => expect(obj).toEqual(obj),
    () => expect({ a: 1 }).toEqual({ a: 1 }),
    () => expect([1]).toEqual([1]),
    () => expect(Promise.resolve(1)).resolves.toEqual(1),
    () => expect(Promise.reject(1)).rejects.toEqual(1)
  );

  assertAllFail(
    () => expect(1).toEqual(2),
    () => expect(1).toEqual(true),
    () => expect({}).toEqual(true),
    () => expect(1).not.toEqual(1),
    () => expect(true).not.toEqual(true)
  );
});

test(async function resolves() {
  const resolves = expect(Promise.resolve(true)).resolves;
  for (let method of ["toEqual", "toBe", "toBeTruthy", "toBeFalsy"])
    assertEquals(typeof resolves[method], "function", `missing ${method}`);
});

test(async function rejects() {
  const rejects = expect(Promise.reject(true)).rejects;
  for (let method of ["toEqual", "toBe", "toBeTruthy", "toBeFalsy"])
    assertEquals(typeof rejects[method], "function");
});

test(async function toBeDefined() {
  assertAllPass(
    () => expect(true).toBeDefined(),
    () => expect({}).toBeDefined(),
    () => expect([]).toBeDefined(),
    () => expect(undefined).not.toBeDefined(),
    () => expect(Promise.resolve({})).resolves.toBeDefined(),
    () => expect(Promise.reject({})).rejects.toBeDefined()
  );

  assertAllFail(
    () => expect(undefined).toBeDefined(),
    () => expect(true).not.toBeDefined()
  );
});

test(async function toBeTruthy() {
  assertAllPass(
    () => expect(true).toBeTruthy(),
    () => expect(false).not.toBeTruthy(),
    () => expect(Promise.resolve(true)).resolves.toBeTruthy(),
    () => expect(Promise.reject(true)).rejects.toBeTruthy()
  );

  assertAllFail(
    () => expect(false).toBeTruthy(),
    () => expect(true).not.toBeTruthy()
  );
});

test(async function toBeFalsy() {
  assertAllPass(
    () => expect(false).toBeFalsy(),
    () => expect(true).not.toBeFalsy(),
    () => expect(Promise.resolve(false)).resolves.toBeFalsy(),
    () => expect(Promise.reject(false)).rejects.toBeFalsy()
  );
  assertAllFail(
    () => expect(true).toBeFalsy(),
    () => expect(false).not.toBeFalsy()
  );
});

test(async function toBeGreaterThan() {
  assertAllPass(
    () => expect(2).toBeGreaterThan(1),
    () => expect(1).not.toBeGreaterThan(2),
    () => expect(Promise.resolve(2)).resolves.toBeGreaterThan(1),
    () => expect(Promise.reject(2)).rejects.toBeGreaterThan(1)
  );

  assertAllFail(
    () => expect(1).toBeGreaterThan(1),
    () => expect(1).toBeGreaterThan(2),
    () => expect(2).not.toBeGreaterThan(1)
  );
});

test(async function toBeLessThan() {
  assertAllPass(
    () => expect(1).toBeLessThan(2),
    () => expect(2).not.toBeLessThan(1),
    () => expect(Promise.resolve(1)).resolves.toBeLessThan(2),
    () => expect(Promise.reject(1)).rejects.toBeLessThan(2)
  );

  assertAllFail(
    () => expect(1).toBeLessThan(1),
    () => expect(2).toBeLessThan(1),
    () => expect(1).not.toBeLessThan(2)
  );
});

test(async function toBeGreaterThanOrEqual() {
  assertAllPass(
    () => expect(2).toBeGreaterThanOrEqual(1),
    () => expect(1).toBeGreaterThanOrEqual(1),
    () => expect(1).not.toBeGreaterThanOrEqual(2),
    () => expect(Promise.resolve(2)).resolves.toBeGreaterThanOrEqual(2),
    () => expect(Promise.reject(2)).rejects.toBeGreaterThanOrEqual(2)
  );

  assertAllFail(
    () => expect(1).toBeGreaterThanOrEqual(2),
    () => expect(2).not.toBeGreaterThanOrEqual(1)
  );
});

test(async function toBeLessThanOrEqual() {
  assertAllPass(
    () => expect(1).toBeLessThanOrEqual(2),
    () => expect(1).toBeLessThanOrEqual(1),
    () => expect(2).not.toBeLessThanOrEqual(1),
    () => expect(Promise.resolve(1)).resolves.toBeLessThanOrEqual(2),
    () => expect(Promise.reject(1)).rejects.toBeLessThanOrEqual(2)
  );
  assertAllFail(
    () => expect(2).toBeLessThanOrEqual(1),
    () => expect(1).not.toBeLessThanOrEqual(1),
    () => expect(1).not.toBeLessThanOrEqual(2)
  );
});

/*
expect.extend(matchers)
expect.anything()
expect.any(constructor)
expect.arrayContaining(array)
expect.assertions(number)
expect.hasAssertions()
expect.not.arrayContaining(array)
expect.not.objectContaining(object)
expect.not.stringContaining(string)
expect.not.stringMatching(string | regexp)
expect.objectContaining(object)
expect.stringContaining(string)
expect.stringMatching(string | regexp)
expect.addSnapshotSerializer(serializer)
.toBe(value)
.toHaveBeenCalled()
.toHaveBeenCalledTimes(number)
.toHaveBeenCalledWith(arg1, arg2, ...)
.toHaveBeenLastCalledWith(arg1, arg2, ...)
.toHaveBeenNthCalledWith(nthCall, arg1, arg2, ....)
.toHaveReturned()
.toHaveReturnedTimes(number)
.toHaveReturnedWith(value)
.toHaveLastReturnedWith(value)
.toHaveNthReturnedWith(nthCall, value)
.toBeCloseTo(number, numDigits?)
.toBeDefined()
.toBeFalsy()
.toBeGreaterThan(number)
.toBeGreaterThanOrEqual(number)
.toBeLessThan(number)
.toBeLessThanOrEqual(number)
.toBeInstanceOf(Class)
.toBeNull()
.toBeTruthy()
.toBeUndefined()
.toBeNaN()
.toContain(item)
.toContainEqual(item)
.toEqual(value)
.toHaveLength(number)
.toMatch(regexpOrString)
.toMatchObject(object)
.toHaveProperty(keyPath, value?)
.toMatchSnapshot(propertyMatchers?, hint?)
.toMatchInlineSnapshot(propertyMatchers?, inlineSnapshot)
.toStrictEqual(value)
.toThrow(error?)
.toThrowErrorMatchingSnapshot(hint?)
.toThrowErrorMatchingInlineSnapshot(inlineSnapshot)
*/

runTests();
