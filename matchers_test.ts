import { runTests, test } from "https://deno.land/std/testing/mod.ts";
import {
  assert,
  assertEquals,
  AssertionError
} from "https://deno.land/std/testing/asserts.ts";

import {
  toBe,
  toBeGreaterThan,
  toBeLessThan,
  toBeLessThanOrEqual,
  toEqual,
  toBeTruthy,
  toBeFalsy,
  toBeDefined,
  toBeUndefined,
  toBeNull,
  toBeNaN,
  toBeInstanceOf,
  toMatch,
  toHaveLength,
  toHaveProperty,
  toContain,
  toThrow,
  MatchResult
} from "./matchers.ts";

function assertResult(actual: MatchResult, expected: MatchResult) {
  assertEquals(
    actual.pass,
    expected.pass,
    `expected to be ${
      expected.pass ? `pass but received: ${actual.message}` : "fail"
    }`
  );
  if (typeof expected.message !== "undefined") {
    assert(!!actual.message, "no message given");
    const colourless = actual.message.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ""
    );
    const trim = x => x.trim().replace(/\s*\n\s+/g, "\n");

    assertEquals(trim(colourless), trim(expected.message));
  }
}

function assertResultPass(result) {
  assertResult(result, { pass: true });
}

test(function toBePass() {
  assertResultPass(toBe(10, 10));
});

test(function toBeFail() {
  assertResult(toBe(10, 20), {
    pass: false,
    message: `expect(actual).toBe(expected)\n\n-   10\n+   20`
  });

  assertResult(toBe({}, {}), {
    pass: false,
    message: `expect(actual).toBe(expected)\n\n    Object {}`
  });
});

test(function toEqualPass() {
  assertResultPass(toEqual({ a: 1 }, { a: 1 }));
  assertResultPass(toEqual(1, 1));
  assertResultPass(toEqual([1], [1]));
});

test(function toEqualFail() {
  assertResult(toEqual(10, 20), {
    pass: false,
    message: `expect(actual).toEqual(expected)\n\n-   10\n+   20`
  });

  assertResult(toEqual({ a: 1 }, { a: 2 }), {
    pass: false,
    message: `expect(actual).toEqual(expected)
            Object {
        -     "a": 1,
        +     "a": 2,
            }`
  });
});

test(function toBeGreaterThanPass() {
  assertResultPass(toBeGreaterThan(2, 1));
});

test(function toBeGreaterThanFail() {
  assertResult(toBeGreaterThan(1, 2), {
    pass: false,
    message: `expect(actual).toBeGreaterThan(expected)

            1 is not greater than 2`
  });
});

test(function toBeLessThanPass() {
  assertResultPass(toBeLessThan(1, 2));
});

test(function toBeLessThanFail() {
  assertResult(toBeLessThan(2, 1), {
    pass: false,
    message: `expect(actual).toBeLessThan(expected)

            2 is not less than 1`
  });
});

test(function toBeLessThanOrEqualPass() {
  assertResultPass(toBeLessThanOrEqual(1, 2));
});

test(function toBeLessThanOrEqualFail() {
  assertResult(toBeLessThanOrEqual(2, 1), {
    pass: false,
    message: `expect(actual).toBeLessThanOrEqual(expected)

            2 is not less than or equal to 1`
  });
});

test(function toBeTruthyPass() {
  assertResultPass(toBeTruthy(1));
  assertResultPass(toBeTruthy(true));
  assertResultPass(toBeTruthy([]));
});

test(function toBeTruthyFail() {
  assertResult(toBeTruthy(false), {
    pass: false,
    message: `expect(actual).toBeTruthy()

              false is not truthy`
  });
});

test(function toBeFalsyPass() {
  assertResultPass(toBeFalsy(0));
  assertResultPass(toBeFalsy(false));
  assertResultPass(toBeFalsy(null));
});

test(function toBeFalsyFail() {
  assertResult(toBeFalsy(true), {
    pass: false,
    message: `expect(actual).toBeFalsy()

              true is not falsy`
  });
});

test(function toBeDefinedPass() {
  assertResultPass(toBeDefined(1));
  assertResultPass(toBeDefined({}));
});

test(function toBeDefinedFail() {
  assertResult(toBeDefined(undefined), {
    pass: false,
    message: `expect(actual).toBeDefined()

              undefined is not defined`
  });
});

test(function toBeUndefinedPass() {
  assertResultPass(toBeUndefined(undefined));
});

test(function toBeUndefinedFail() {
  assertResult(toBeUndefined(null), {
    pass: false,
    message: `expect(actual).toBeUndefined()

              null is defined but should be undefined`
  });
});

test(function toBeNullPass() {
  assertResultPass(toBeNull(null));
});

test(function toBeNullFail() {
  assertResult(toBeNull(10), {
    pass: false,
    message: `expect(actual).toBeNull()

              10 should be null`
  });
});

test(function toBeNaNPass() {
  assertResultPass(toBeNaN(NaN));
});

test(function toBeNaNFail() {
  assertResult(toBeNaN(10), {
    pass: false,
    message: `expect(actual).toBeNaN()

              10 should be NaN`
  });
});

test(function toBeInstanceOfPass() {
  class A {}
  const a = new A();
  assertResultPass(toBeInstanceOf(a, A));
});

test(function toBeNaNFail() {
  class A {}
  class B {}

  const a = new A();

  assertResult(toBeInstanceOf(a, B), {
    pass: false,
    message: `expect(actual).toBeInstanceOf(expected)

              expected B but received A {}`
  });
});

test(function toBeMatchPass() {
  assertResultPass(toMatch("hello", "hell"));
  assertResultPass(toMatch("hello", /^hell/));
});

test(function toBeMatchFail() {
  assertResult(toMatch("yo", "hell"), {
    pass: false,
    message: `expect(actual).toMatch(expected)

              expected "yo" to contain "hell"`
  });

  assertResult(toMatch("yo", /^hell/), {
    pass: false,
    message: `expect(actual).toMatch(expected)

              "yo" did not match regex /^hell/`
  });
});

test(function toBeHavePropertyPass() {
  assertResultPass(toHaveProperty({ a: 1 }, "a"));
});

test(function toBeHavePropertyFail() {
  assertResult(toHaveProperty({ a: 1 }, "b"), {
    pass: false,
    message: `expect(actual).toHaveProperty(expected)\n\n    Object {\n"a": 1,\n} did not contain property "b"`
  });
});

test(function toHaveLengthPass() {
  assertResultPass(toHaveLength([], 0));
  assertResultPass(toHaveLength([1, 2], 2));
  assertResultPass(toHaveLength({ length: 2 }, 2));
});

test(function toBeHaveLengthFail() {
  assertResult(toHaveLength([], 1), {
    pass: false,
    message: `expect(actual).toHaveLength(expected)\n\n    expected array to have length 1 but was 0`
  });
});

test(function toContainPass() {
  assertResultPass(toContain([1, 2], 2));
});

test(function toContainFail() {
  assertResult(toContain([2, 3], 1), {
    pass: false,
    message: `expect(actual).toContain(expected)
    
    Array [
      2,
      3,
    ] did not contain 1`
  });
  assertResult(toContain(false, 1), {
    pass: false,
    message: `expect(actual).toContain(expected)
        expected false to contain 1 but it is not an array`
  });
});

test(function toThrowPass() {
  assertResultPass(
    toThrow(() => {
      throw new Error("TEST");
    }, "TEST")
  );
  assertResultPass(
    toThrow(() => {
      throw new Error("TEST");
    }, /^TEST/)
  );
});

test(function toThrowFail() {
  assertResult(toThrow(() => {}, "TEST"), {
    pass: false,
    message: `expect(actual).toThrow(expected)
    
    expected [Function anonymous] to throw but it did not`
  });

  assertResult(
    toThrow(() => {
      throw new Error("BLAH");
    }, "TEST"),
    {
      pass: false,
      message: `expect(actual).toThrow(expected)
    
    expected [Function anonymous] to throw error matching \"TEST\" but it threw Error: BLAH`
    }
  );

  assertResult(
    toThrow(() => {
      throw new Error("BLAH");
    }, /^TEST/),
    {
      pass: false,
      message: `expect(actual).toThrow(expected)
    
    expected [Function anonymous] to throw error matching /^TEST/ but it threw Error: BLAH`
    }
  );
});

//TODO(allain) - toHaveBeenCalled(value: any): MatchResult
//TODO(allain) - toHaveBeenCalledTimes(value: any, times: number): MatchResult
//TODO(allain) - toHaveBeenCalledWith(value: any, ...args: any[]): MatchResult
//TODO(allain) - toHaveBeenLastCalledWith(value: any, ...args: any[]): MatchResult
//TODO(allain) - toHaveBeenNthCalledWith(value: any, nth: number, ...args: any[]): MatchResult
//TODO(allain) - toHaveReturnedWith(value: any, result: any): MatchResult
//TODO(allain) - toHaveReturned(value: any): MatchResult
//TODO(allain) - toHaveLastReturnedWith(value: any, expected: any): MatchResult
//TODO(allain) - toHaveReturnedTimes(value: any, times: number): MatchResult
//TODO(allain) - toHaveNthReturnedWith(value: any, nth: number, expected: any): MatchResult

runTests();
