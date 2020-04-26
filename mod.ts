import * as m from "./mock.ts";
export const mock = m;

export * from "./expect.ts";
export function it(name: string, fn: () => void | Promise<void>) {
  Deno.test({
    name,
    fn,
  });
}
