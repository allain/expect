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

async function assertFail(fn) {
  let thrown = true;
  try {
    let resolution = await fn();
    thrown = false;
    throw new AssertionError(
      `expected ${fn.toString()} to throw but it resolved with ${resolution}`
    );
  } catch (err) {
    // expected
    if (!thrown) throw err;
  }
}

async function assertAllFail(...fns) {
  for (let fn of fns) {
    await assertFail(fn);
  }
}

test(function exportsFunction() {
  assertEquals(typeof expect, "function");
});

test(async function toBe() {
  const obj = {};
  assertEquals(typeof expect(obj).toBe, "function");
  await assertAllPass(
    () => expect(obj).toBe(obj),
    () => expect(obj).not.toBe({}),
    () => expect(Promise.resolve(1)).resolves.toBe(1),
    () => expect(Promise.reject(1)).rejects.toBe(1)
  );

  await assertFail(() => expect(obj).toBe({}));
  await assertFail(() => expect(obj).not.toBe(obj));
});

test(async function toEqual() {
  const obj = {};

  await assertAllPass(
    () => expect(1).toEqual(1),
    () => expect(obj).toEqual({}),
    () => expect(obj).toEqual(obj),
    () => expect({ a: 1 }).toEqual({ a: 1 }),
    () => expect([1]).toEqual([1]),
    () => expect(Promise.resolve(1)).resolves.toEqual(1),
    () => expect(Promise.reject(1)).rejects.toEqual(1)
  );

  await assertAllFail(
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
  await assertAllPass(
    () => expect(true).toBeDefined(),
    () => expect({}).toBeDefined(),
    () => expect([]).toBeDefined(),
    () => expect(undefined).not.toBeDefined(),
    () => expect(Promise.resolve({})).resolves.toBeDefined(),
    () => expect(Promise.reject({})).rejects.toBeDefined()
  );

  await assertAllFail(
    () => expect(undefined).toBeDefined(),
    () => expect(true).not.toBeDefined()
  );
});

test(async function toBeUndefined() {
  await assertAllPass(
    () => expect(undefined).toBeUndefined(),
    () => expect(null).not.toBeUndefined(),
    () => expect(Promise.resolve(undefined)).resolves.toBeUndefined(),
    () => expect(Promise.reject(undefined)).rejects.toBeUndefined()
  );

  await assertAllFail(
    () => expect(null).toBeUndefined(),
    () => expect(undefined).not.toBeUndefined(),
    () => expect(false).toBeUndefined()
  );
});

test(async function toBeTruthy() {
  await assertAllPass(
    () => expect(true).toBeTruthy(),
    () => expect(false).not.toBeTruthy(),
    () => expect(Promise.resolve(true)).resolves.toBeTruthy(),
    () => expect(Promise.reject(true)).rejects.toBeTruthy()
  );

  await assertAllFail(
    () => expect(false).toBeTruthy(),
    () => expect(true).not.toBeTruthy()
  );
});

test(async function toBeFalsy() {
  await assertAllPass(
    () => expect(false).toBeFalsy(),
    () => expect(true).not.toBeFalsy(),
    () => expect(Promise.resolve(false)).resolves.toBeFalsy(),
    () => expect(Promise.reject(false)).rejects.toBeFalsy()
  );
  await assertAllFail(
    () => expect(true).toBeFalsy(),
    () => expect(false).not.toBeFalsy()
  );
});

test(async function toBeGreaterThan() {
  await assertAllPass(
    () => expect(2).toBeGreaterThan(1),
    () => expect(1).not.toBeGreaterThan(2),
    () => expect(Promise.resolve(2)).resolves.toBeGreaterThan(1),
    () => expect(Promise.reject(2)).rejects.toBeGreaterThan(1)
  );

  await assertAllFail(
    () => expect(1).toBeGreaterThan(1),
    () => expect(1).toBeGreaterThan(2),
    () => expect(2).not.toBeGreaterThan(1)
  );
});

test(async function toBeLessThan() {
  await assertAllPass(
    () => expect(1).toBeLessThan(2),
    () => expect(2).not.toBeLessThan(1),
    () => expect(Promise.resolve(1)).resolves.toBeLessThan(2),
    () => expect(Promise.reject(1)).rejects.toBeLessThan(2)
  );

  await assertAllFail(
    () => expect(1).toBeLessThan(1),
    () => expect(2).toBeLessThan(1),
    () => expect(1).not.toBeLessThan(2)
  );
});

test(async function toBeGreaterThanOrEqual() {
  await assertAllPass(
    () => expect(2).toBeGreaterThanOrEqual(1),
    () => expect(1).toBeGreaterThanOrEqual(1),
    () => expect(1).not.toBeGreaterThanOrEqual(2),
    () => expect(Promise.resolve(2)).resolves.toBeGreaterThanOrEqual(2),
    () => expect(Promise.reject(2)).rejects.toBeGreaterThanOrEqual(2)
  );

  await assertAllFail(
    () => expect(1).toBeGreaterThanOrEqual(2),
    () => expect(2).not.toBeGreaterThanOrEqual(1)
  );
});

test(async function toBeLessThanOrEqual() {
  await assertAllPass(
    () => expect(1).toBeLessThanOrEqual(2),
    () => expect(1).toBeLessThanOrEqual(1),
    () => expect(2).not.toBeLessThanOrEqual(1),
    () => expect(Promise.resolve(1)).resolves.toBeLessThanOrEqual(2),
    () => expect(Promise.reject(1)).rejects.toBeLessThanOrEqual(2)
  );
  await assertAllFail(
    () => expect(2).toBeLessThanOrEqual(1),
    () => expect(1).not.toBeLessThanOrEqual(1),
    () => expect(1).not.toBeLessThanOrEqual(2)
  );
});

test(async function toBeNull() {
  await assertAllPass(
    () => expect(null).toBeNull(),
    () => expect(undefined).not.toBeNull(),
    () => expect(false).not.toBeNull(),
    () => expect(Promise.resolve(null)).resolves.toBeNull(),
    () => expect(Promise.reject(null)).rejects.toBeNull()
  );

  await assertAllFail(
    () => expect({}).toBeNull(),
    () => expect(null).not.toBeNull(),
    () => expect(undefined).toBeNull()
  );
});

test(async function toBeInstanceOf() {
  class A {}
  class B {}

  await assertAllPass(
    () => expect(new A()).toBeInstanceOf(A),
    () => expect(new A()).not.toBeInstanceOf(B)
  );

  await assertAllFail(
    () => expect({}).toBeInstanceOf(A),
    () => expect(null).toBeInstanceOf(A)
  );
});

test(async function toBeNaN() {
  await assertAllPass(
    () => expect(NaN).toBeNaN(),
    () => expect(10).not.toBeNaN(),
    () => expect(Promise.resolve(NaN)).resolves.toBeNaN()
  );

  await assertAllFail(() => expect(10).toBeNaN(), () => expect(10).toBeNaN());
});

test(async function toBeMatch() {
  await assertAllPass(
    () => expect("hello").toMatch(/^hell/),
    () => expect("hello").toMatch("hello"),
    () => expect("hello").toMatch("hell")
  );

  await assertAllFail(() => expect("yo").toMatch(/^hell/));
});

test(async function toHaveProperty() {
  await assertAllPass(() => expect({ a: "10" }).toHaveProperty("a"));

  await assertAllFail(() => expect({ a: 1 }).toHaveProperty("b"));
});

test(async function toHaveLength() {
  await assertAllPass(
    () => expect([1, 2]).toHaveLength(2),
    () => expect({ length: 10 }).toHaveLength(10)
  );

  await assertAllFail(() => expect([]).toHaveLength(10));
});

test(async function toContain() {
  await assertAllPass(
    () => expect([1, 2, 3]).toContain(2),
    () => expect([]).not.toContain(2)
  );

  await assertAllFail(
    () => expect([1, 2, 3]).toContain(4),
    () => expect([]).toContain(4)
  );
});

test(async function toThrow() {
  /*
  await assertAllPass(
    () =>
      expect(() => {
        throw new Error("TEST");
      }).toThrow("TEST"),

    () => expect(Promise.reject(new Error("TEST"))).rejects.toThrow("TEST")
  );
  */

  await assertAllFail(() => expect(() => true).toThrow());
});

runTests();
