import * as m from "./mock.ts";
export const mock = m;

export * from "./expect.ts";
export function it(name, fn) {
  Deno.test({
    name,
    fn,
  });
}
