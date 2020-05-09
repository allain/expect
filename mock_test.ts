import {
  assert,
  assertEquals,
} from "https://deno.land/std@v0.50.0/testing/asserts.ts";

import * as mock from "./mock.ts";

Deno.test({
  name: "canMockFunctions",
  fn: () => {
    assertEquals(typeof mock.fn(), "function");
    const f = mock.fn();
    f(10);
    f(20);

    const calls = mock.calls(f);
    assert(Array.isArray(calls));
    assertEquals(calls.length, 2);
    assertEquals(calls.map((c: any) => c.args), [[10], [20]]);
    assertEquals(calls.map((c: any) => c.returned), [undefined, undefined]);

    assert(
      calls.map((c: any) => typeof c.timestamp).every((t: string) =>
        t === "number"
      ),
    );
  },
});

Deno.test({
  name: "mockFunctionTracksReturns",
  fn: () => {
    const f = mock.fn(
      () => 1,
      () => {
        throw new Error("TEST");
      },
    );
    try {
      f();
      f();
    } catch {}
    const calls = mock.calls(f);
    assert(calls[0].returns);
    assert(!calls[0].throws);
    assert(!calls[1].returns);
    assert(calls[1].throws);
  },
});

Deno.test({
  name: "mockFunctionCanHaveImplementations",
  fn: () => {
    const f = mock.fn(
      (n: number) => n,
      (n: number) => n * 2,
      (n: number) => n * 3,
    );
    f(1);
    f(1);
    f(1);
    f(1);
    f(1);

    const calls = mock.calls(f);
    assertEquals(calls.length, 5);
    assertEquals(
      calls.map((c: mock.MockCall) => c.returned),
      [1, 2, 3, undefined, undefined],
    );
  },
});
