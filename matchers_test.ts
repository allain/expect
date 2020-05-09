import {
  assert,
  assertEquals,
} from "https://deno.land/std@v0.50.0/testing/asserts.ts";
import * as mock from "./mock.ts";

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
  toHaveBeenCalled,
  toHaveBeenCalledTimes,
  toHaveBeenCalledWith,
  toHaveBeenLastCalledWith,
  toHaveBeenNthCalledWith,
  toHaveReturnedWith,
  toHaveReturned,
  toHaveLastReturnedWith,
  toHaveReturnedTimes,
  toHaveNthReturnedWith,
} from "./matchers.ts";

function assertResult(actual: MatchResult, expected: MatchResult) {
  assertEquals(
    actual.pass,
    expected.pass,
    `expected to be ${
      expected.pass ? `pass but received: ${actual.message}` : "fail"
    }`,
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

Deno.test({
  name: "toBePass",
  fn: () => {
    assertResultPass(toBe(10, 10));
  },
});

Deno.test({
  name: "toBeFail",
  fn: () => {
    assertResult(toBe(10, 20), {
      pass: false,
      message: `expect(actual).toBe(expected)
                -   10
                +   20`,
    });

    assertResult(toBe({}, {}), {
      pass: false,
      message: `expect(actual).toBe(expected)
      
                {}`,
    });
  },
});

Deno.test({
  name: "toEqualPass",
  fn: () => {
    assertResultPass(toEqual({ a: 1 }, { a: 1 }));
    assertResultPass(toEqual(1, 1));
    assertResultPass(toEqual([1], [1]));
  },
});

Deno.test({
  name: "toEqualFail",
  fn: () => {
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
  },
});

Deno.test({
  name: "toBeGreaterThanPass",
  fn: () => {
    assertResultPass(toBeGreaterThan(2, 1));
  },
});

Deno.test({
  name: "toBeGreaterThanFail",
  fn: () => {
    assertResult(toBeGreaterThan(1, 2), {
      pass: false,
      message: `expect(actual).toBeGreaterThan(expected)
  
                1 is not greater than 2`,
    });
  },
});

Deno.test({
  name: "toBeLessThanPass",
  fn: () => {
    assertResultPass(toBeLessThan(1, 2));
  },
});

Deno.test({
  name: "toBeLessThanFail",
  fn: () => {
    assertResult(toBeLessThan(2, 1), {
      pass: false,
      message: `expect(actual).toBeLessThan(expected)
  
                2 is not less than 1`,
    });
  },
});

Deno.test({
  name: "toBeLessThanOrEqualPass",
  fn: () => {
    assertResultPass(toBeLessThanOrEqual(1, 2));
  },
});

Deno.test({
  name: "toBeLessThanOrEqualFail",
  fn: () => {
    assertResult(toBeLessThanOrEqual(2, 1), {
      pass: false,
      message: `expect(actual).toBeLessThanOrEqual(expected)
  
                2 is not less than or equal to 1`,
    });
  },
});

Deno.test({
  name: "toBeTruthyPass",
  fn: () => {
    assertResultPass(toBeTruthy(1));
    assertResultPass(toBeTruthy(true));
    assertResultPass(toBeTruthy([]));
  },
});

Deno.test({
  name: "toBeTruthyFail",
  fn: () => {
    assertResult(toBeTruthy(false), {
      pass: false,
      message: `expect(actual).toBeTruthy()
  
                false is not truthy`,
    });
  },
});

Deno.test({
  name: "toBeFalsyPass",
  fn: () => {
    assertResultPass(toBeFalsy(0));
    assertResultPass(toBeFalsy(false));
    assertResultPass(toBeFalsy(null));
  },
});

Deno.test({
  name: "toBeFalsyFail",
  fn: () => {
    assertResult(toBeFalsy(true), {
      pass: false,
      message: `expect(actual).toBeFalsy()
  
                true is not falsy`,
    });
  },
});

Deno.test({
  name: "toBeDefinedPass",
  fn: () => {
    assertResultPass(toBeDefined(1));
    assertResultPass(toBeDefined({}));
  },
});

Deno.test({
  name: "toBeDefinedFail",
  fn: () => {
    assertResult(toBeDefined(undefined), {
      pass: false,
      message: `expect(actual).toBeDefined()
  
                undefined is not defined`,
    });
  },
});

Deno.test({
  name: "toBeUndefinedPass",
  fn: () => {
    assertResultPass(toBeUndefined(undefined));
  },
});

Deno.test({
  name: "toBeUndefinedFail",
  fn: () => {
    assertResult(toBeUndefined(null), {
      pass: false,
      message: `expect(actual).toBeUndefined()
  
                null is defined but should be undefined`,
    });
  },
});

Deno.test({
  name: "toBeNullPass",
  fn: () => {
    assertResultPass(toBeNull(null));
  },
});

Deno.test({
  name: "toBeNullFail",
  fn: () => {
    assertResult(toBeNull(10), {
      pass: false,
      message: `expect(actual).toBeNull()
  
                10 should be null`,
    });
  },
});

Deno.test({
  name: "toBeNaNPass",
  fn: () => {
    assertResultPass(toBeNaN(NaN));
  },
});

Deno.test({
  name: "toBeNaNFail",
  fn: () => {
    assertResult(toBeNaN(10), {
      pass: false,
      message: `expect(actual).toBeNaN()
  
                10 should be NaN`,
    });
  },
});

Deno.test({
  name: "toBeInstanceOfPass",
  fn: () => {
    class A {}
    const a = new A();
    assertResultPass(toBeInstanceOf(a, A));
  },
});

Deno.test({
  name: "toBeInstanceOfFail",
  fn: () => {
    class A {}
    class B {}

    const a = new A();

    assertResult(toBeInstanceOf(a, B), {
      pass: false,
      message: `expect(actual).toBeInstanceOf(expected)

                expected B but received A {}`,
    });
  },
});

Deno.test({
  name: "toBeMatchPass",
  fn: () => {
    assertResultPass(toMatch("hello", "hell"));
    assertResultPass(toMatch("hello", /^hell/));
  },
});

Deno.test({
  name: "toBeMatchFail",
  fn: () => {
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
  },
});

Deno.test({
  name: "toBeHavePropertyPass",
  fn: () => {
    assertResultPass(toHaveProperty({ a: 1 }, "a"));
  },
});

Deno.test({
  name: "toBeHavePropertyFail",
  fn: () => {
    assertResult(toHaveProperty({ a: 1 }, "b"), {
      pass: false,
      message: `expect(actual).toHaveProperty(expected)
      
                { a: 1 } did not contain property b`,
    });
  },
});

Deno.test({
  name: "toHaveLengthPass",
  fn: () => {
    assertResultPass(toHaveLength([], 0));
    assertResultPass(toHaveLength([1, 2], 2));
    assertResultPass(toHaveLength({ length: 2 }, 2));
  },
});

Deno.test({
  name: "toBeHaveLengthFail",
  fn: () => {
    assertResult(toHaveLength([], 1), {
      pass: false,
      message: `expect(actual).toHaveLength(expected)
        
                expected array to have length 1 but was 0`,
    });
  },
});

Deno.test({
  name: "toContainPass",
  fn: () => {
    assertResultPass(toContain([1, 2], 2));
  },
});

Deno.test({
  name: "toContainFail",
  fn: () => {
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
  },
});

Deno.test({
  name: "toThrowPass",
  fn: () => {
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
  },
});

Deno.test({
  name: "toThrowFail",
  fn: () => {
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
  },
});

Deno.test({
  name: "toHaveBeenCalledPass",
  fn: () => {
    const m = mock.fn();
    m(10);
    assertResultPass(toHaveBeenCalled(m));
  },
});

Deno.test({
  name: "toHaveBeenCalledFail",
  fn: () => {
    const m = mock.fn();
    assertResult(toHaveBeenCalled(m), {
      pass: false,
      message: `expect(actual).toHaveBeenCalled()
      
                [Function: f] was not called`,
    });
  },
});

Deno.test({
  name: "toHaveBeenCalledTimesPass",
  fn: () => {
    const m = mock.fn();
    m(10);
    m(12);
    assertResultPass(toHaveBeenCalledTimes(m, 2));
  },
});

Deno.test({
  name: "toHaveBeenCalledTimesFail",
  fn: () => {
    const m = mock.fn();
    m(10);
    assertResult(toHaveBeenCalledTimes(m, 2), {
      pass: false,
      message: `expect(actual).toHaveBeenCalledTimes(expected)
      
                expected 2 calls but was called: 1`,
    });
  },
});

Deno.test({
  name: "toHaveBeenCalledWithPass",
  fn: () => {
    const m = mock.fn();
    m(1, "a");
    assertResultPass(toHaveBeenCalledWith(m, 1, "a"));
  },
});

Deno.test({
  name: "toHaveBeenCalledWithFail",
  fn: () => {
    const m = mock.fn();
    m(1, "a");
    assertResult(toHaveBeenCalledWith(m, 2, "b"), {
      pass: false,
      message: `expect(actual).toHaveBeenCalledWith(expected)
      
                function was not called with: [ 2, "b" ]`,
    });
  },
});

Deno.test({
  name: "toHaveBeenLastCalledWithPass",
  fn: () => {
    const m = mock.fn();
    m(1, "a");
    m(2, "b");
    m(3, "c");
    assertResultPass(toHaveBeenLastCalledWith(m, 3, "c"));
  },
});

Deno.test({
  name: "toHaveBeenLastCalledWithPass",
  fn: () => {
    const m = mock.fn();
    assertResult(toHaveBeenLastCalledWith(m, 2, "b"), {
      pass: false,
      message: `expect(actual).toHaveBeenLastCalledWith(...expected)
      
                expect last call args to be 2,b but was not called`,
    });
    m(1, "a");
    m(2, "b");
    m(3, "c");
    assertResult(toHaveBeenLastCalledWith(m, 2, "b"), {
      pass: false,
      message: `expect(actual).toHaveBeenLastCalledWith(...expected)
      
                expect last call args to be 2,b but was: 3,c`,
    });
  },
});

Deno.test({
  name: "toHaveBeenNthCalledWithPass",
  fn: () => {
    const m = mock.fn();
    m(1, "a");
    m(2, "b");
    m(3, "c");
    const nthCall = 2;
    assertResultPass(toHaveBeenNthCalledWith(m, nthCall, 2, "b"));
  },
});

Deno.test({
  name: "toHaveBeenNthCalledWithFail",
  fn: () => {
    const m = mock.fn();
    const nthCall = 3;
    assertResult(toHaveBeenNthCalledWith(m, nthCall, 2, "b"), {
      pass: false,
      message: `expect(actual).toHaveBeenNthCalledWith(expected)
      
                3th call was not made.`,
    });
    m(1, "a");
    m(2, "b");
    m(3, "c");
    assertResult(toHaveBeenNthCalledWith(m, nthCall, 2, "b"), {
      pass: false,
      message: `expect(actual).toHaveBeenNthCalledWith(expected)
      
                expect 3th call args to be 2,b but was: 3,c`,
    });
  },
});

Deno.test({
  name: "toHaveReturnedWithPass",
  fn: () => {
    const m = mock.fn(() => true);
    m();
    assertResultPass(toHaveReturnedWith(m, true));
  },
});

Deno.test({
  name: "toHaveReturnedWithFail",
  fn: () => {
    const m = mock.fn(() => true);
    m();
    assertResult(toHaveReturnedWith(m, false), {
      pass: false,
      message: `expect(actual).toHaveReturnedWith(expected)
      
                function did not return: false`,
    });
  },
});

Deno.test({
  name: "toHaveReturnedPass",
  fn: () => {
    const m = mock.fn(() => true);
    m();
    assertResultPass(toHaveReturned(m));
  },
});

Deno.test({
  name: "toHaveReturnedFail",
  fn: () => {
    const m = mock.fn(() => true);
    assertResult(toHaveReturned(m), {
      pass: false,
      message: `expected function to return but it never did`,
    });
  },
});

Deno.test({
  name: "toHaveLastReturnedWithPass",
  fn: () => {
    const m = mock.fn((arg: boolean) => arg);
    m(false);
    m(true);
    assertResultPass(toHaveLastReturnedWith(m, true));
  },
});

Deno.test({
  name: "toHaveLastReturnedWithFail",
  fn: () => {
    const m = mock.fn((arg: boolean) => arg);
    assertResult(toHaveLastReturnedWith(m, true), {
      pass: false,
      message: `no calls made to function`,
    });
    m(true);
    m(false);
    assertResult(toHaveLastReturnedWith(m, true), {
      pass: false,
      message: `expected last call to return true but returned: false`,
    });
  },
});

Deno.test({
  name: "toHaveReturnedTimesPass",
  fn: () => {
    const m = mock.fn(() => true);
    m();
    m();
    m();
    assertResultPass(toHaveReturnedTimes(m, 3));
  },
});

Deno.test({
  name: "toHaveReturnedTimesFail",
  fn: () => {
    const m = mock.fn(() => true);
    m();
    assertResult(toHaveReturnedTimes(m, 3), {
      pass: false,
      message: `expected 3 returned times but returned 1 times`,
    });
  },
});

Deno.test({
  name: "toHaveNthReturnedWithPass",
  fn: () => {
    const m = mock.fn((n: number) => n);
    m(1);
    m(2);
    m(3);
    const nthCall = 2;
    assertResultPass(toHaveNthReturnedWith(m, nthCall, 2));
  },
});

Deno.test({
  name: "toHaveNthReturnedWithFail",
  fn: () => {
    const m = mock.fn((n: number) => n);
    m(1);
    m(2);
    m(3);
    assertResult(toHaveNthReturnedWith(m, 2, 1), {
      pass: false,
      message: `expected 2th call to return 1 but returned: 2`,
    });
    assertResult(toHaveNthReturnedWith(m, 9, 1), {
      pass: false,
      message: `9 calls were now made`,
    });
  },
});
