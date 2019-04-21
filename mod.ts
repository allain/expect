import { test } from "https://deno.land/std/testing/mod.ts";
import * as m from "./mock.ts";
export const mock = m;

export * from "./expect.ts";
export function it(name, fn) {
  test({
    name,
    fn
  });
}
