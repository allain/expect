import {
  assert,
  assertEquals,
  AssertionError,
} from "https://deno.land/std@v0.41.0/testing/asserts.ts";

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
  MatchResult,
} from "./matchers.ts";

function assertResult(actual: MatchResult, expected: MatchResult) {
  assertEquals(
    actual.pass,
    expected.pass,
    `expected to be ${expected.pass
      ? `pass but received: ${actual.message}`
      : "fail"}`,
  );
  if (typeof expected.message !== "undefined") {
    assert(!!actual.message, "no message given");
    const colourless = actual.message.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      "",
    );
    const trim = (x: string) => x.trim().replace(/\s*\n\s+/g, "\n");

    assertEquals(trim(colourless), trim(expected.message));
  }
}

function assertResultPass(result: any) {
  assertResult(result, { pass: true });
}

Deno.test(function toBePass() {
  assertResultPass(toBe(10, 10));
});

Deno.test(function toBeFail() {
  assertResult(toBe(10, 20), {
    pass: false,
    message: `expect(actual).toBe(expected)\n\n-   10\n+   20`,
  });

  assertResult(toBe({}, {}), {
    pass: false,
    message: `expect(actual).toBe(expected)\n\n    {}`,
  });
});

Deno.test(function toEqualPass() {
  assertResultPass(toEqual({ a: 1 }, { a: 1 }));
  assertResultPass(toEqual(1, 1));
  assertResultPass(toEqual([1], [1]));
});

Deno.test(function toEqualFail() {
  assertResult(toEqual(10, 20), {
    pass: false,
    message: `expect(actual).toEqual(expected)\n\n-   10\n+   20`,
  });

  assertResult(toEqual({ a: 1 }, { a: 2 }), {
    pass: false,
    message: `expect(actual).toEqual(expected)
        -   { a: 1 }
        +   { a: 2 }`,
  });
});

Deno.test(function toBeGreaterThanPass() {
  assertResultPass(toBeGreaterThan(2, 1));
});

Deno.test(function toBeGreaterThanFail() {
  assertResult(toBeGreaterThan(1, 2), {
    pass: false,
    message: `expect(actual).toBeGreaterThan(expected)

            1 is not greater than 2`,
  });
});

Deno.test(function toBeLessThanPass() {
  assertResultPass(toBeLessThan(1, 2));
});

Deno.test(function toBeLessThanFail() {
  assertResult(toBeLessThan(2, 1), {
    pass: false,
    message: `expect(actual).toBeLessThan(expected)

            2 is not less than 1`,
  });
});

Deno.test(function toBeLessThanOrEqualPass() {
  assertResultPass(toBeLessThanOrEqual(1, 2));
});

Deno.test(function toBeLessThanOrEqualFail() {
  assertResult(toBeLessThanOrEqual(2, 1), {
    pass: false,
    message: `expect(actual).toBeLessThanOrEqual(expected)

            2 is not less than or equal to 1`,
  });
});

Deno.test(function toBeTruthyPass() {
  assertResultPass(toBeTruthy(1));
  assertResultPass(toBeTruthy(true));
  assertResultPass(toBeTruthy([]));
});

Deno.test(function toBeTruthyFail() {
  assertResult(toBeTruthy(false), {
    pass: false,
    message: `expect(actual).toBeTruthy()

              false is not truthy`,
  });
});

Deno.test(function toBeFalsyPass() {
  assertResultPass(toBeFalsy(0));
  assertResultPass(toBeFalsy(false));
  assertResultPass(toBeFalsy(null));
});

Deno.test(function toBeFalsyFail() {
  assertResult(toBeFalsy(true), {
    pass: false,
    message: `expect(actual).toBeFalsy()

              true is not falsy`,
  });
});

Deno.test(function toBeDefinedPass() {
  assertResultPass(toBeDefined(1));
  assertResultPass(toBeDefined({}));
});

Deno.test(function toBeDefinedFail() {
  assertResult(toBeDefined(undefined), {
    pass: false,
    message: `expect(actual).toBeDefined()

              undefined is not defined`,
  });
});

Deno.test(function toBeUndefinedPass() {
  assertResultPass(toBeUndefined(undefined));
});

Deno.test(function toBeUndefinedFail() {
  assertResult(toBeUndefined(null), {
    pass: false,
    message: `expect(actual).toBeUndefined()

              null is defined but should be undefined`,
  });
});

Deno.test(function toBeNullPass() {
  assertResultPass(toBeNull(null));
});

Deno.test(function toBeNullFail() {
  assertResult(toBeNull(10), {
    pass: false,
    message: `expect(actual).toBeNull()

              10 should be null`,
  });
});

Deno.test(function toBeNaNPass() {
  assertResultPass(toBeNaN(NaN));
});

Deno.test(function toBeNaNFail() {
  assertResult(toBeNaN(10), {
    pass: false,
    message: `expect(actual).toBeNaN()

              10 should be NaN`,
  });
});

Deno.test(function toBeInstanceOfPass() {
  class A {}
  const a = new A();
  assertResultPass(toBeInstanceOf(a, A));
});

Deno.test(function toBeNaNFail() {
  class A {}
  class B {}

  const a = new A();

  assertResult(toBeInstanceOf(a, B), {
    pass: false,
    message: `expect(actual).toBeInstanceOf(expected)

              expected B but received A {}`,
  });
});

Deno.test(function toBeMatchPass() {
  assertResultPass(toMatch("hello", "hell"));
  assertResultPass(toMatch("hello", /^hell/));
});

Deno.test(function toBeMatchFail() {
  assertResult(toMatch("yo", "hell"), {
    pass: false,
    message: `expect(actual).toMatch(expected)

              expected yo to contain hell`,
  });

  assertResult(toMatch("yo", /^hell/), {
    pass: false,
    message: `expect(actual).toMatch(expected)

              yo did not match regex /^hell/`,
  });
});

Deno.test(function toBeHavePropertyPass() {
  assertResultPass(toHaveProperty({ a: 1 }, "a"));
});

Deno.test(function toBeHavePropertyFail() {
  assertResult(toHaveProperty({ a: 1 }, "b"), {
    pass: false,
    message:
      `expect(actual).toHaveProperty(expected)\n\n    { a: 1 } did not contain property b`,
  });
});

Deno.test(function toHaveLengthPass() {
  assertResultPass(toHaveLength([], 0));
  assertResultPass(toHaveLength([1, 2], 2));
  assertResultPass(toHaveLength({ length: 2 }, 2));
});

Deno.test(function toBeHaveLengthFail() {
  assertResult(toHaveLength([], 1), {
    pass: false,
    message:
      `expect(actual).toHaveLength(expected)\n\n    expected array to have length 1 but was 0`,
  });
});

Deno.test(function toContainPass() {
  assertResultPass(toContain([1, 2], 2));
});

Deno.test(function toContainFail() {
  assertResult(toContain([2, 3], 1), {
    pass: false,
    message: `expect(actual).toContain(expected)
    
    [ 2, 3 ] did not contain 1`,
  });
  assertResult(toContain(false, 1), {
    pass: false,
    message: `expect(actual).toContain(expected)
        expected false to contain 1 but it is not an array`,
  });
});

Deno.test(function toThrowPass() {
  assertResultPass(
    toThrow(() => {
      throw new Error("TEST");
    }, "TEST"),
  );
  assertResultPass(
    toThrow(() => {
      throw new Error("TEST");
    }, /^TEST/),
  );
});

Deno.test(function toThrowFail() {
  assertResult(toThrow(() => {}, "TEST"), {
    pass: false,
    message: `expect(actual).toThrow(expected)
    
    expected [Function] to throw but it did not`,
  });

  assertResult(
    toThrow(() => {
      throw new Error("BLAH");
    }, "TEST"),
    {
      pass: false,
      message: `expect(actual).toThrow(expected)
    
    expected [Function] to throw error matching TEST but it threw Error: BLAH`,
    },
  );

  assertResult(
    toThrow(() => {
      throw new Error("BLAH");
    }, /^TEST/),
    {
      pass: false,
      message: `expect(actual).toThrow(expected)
    
    expected [Function] to throw error matching /^TEST/ but it threw Error: BLAH`,
    },
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
