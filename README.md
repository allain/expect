# expect

[![][ghw badge]][ghw link]

A deno implementation of `expect` in order to write tests in a more `jest` like style.

```typescript
import { expect } from 'https://deno.land/x/expect/mod.ts'

expect(10).toEqual(10)
expect(Promise.resolve(20)).resolves.toEqual(20)
```

```typescript
interface Expected {
  toBe(candidate: any, msg?: string): void
  toEqual(candidate: any, msg?: string): void
  toBeTruthy(msg?: string): void
  toBeFalsy(msg?: string): void
  toBeDefined(msg?: string): void
  toBeInstanceOf(clazz: any, msg?: string): void
  toBeUndefined(msg?: string): void
  toBeNull(msg?: string): void
  toBeNaN(msg?: string): void
  toMatch(pattern: RegExp | string): void
  toHaveProperty(propName: string, msg?: string): void
  toHaveLength(length: number, msg?: string): void
  toContain(item: any, msg?: string): void
  toThrow(error?: RegExp | string, msg?: string): void

  // comparison
  toBeGreaterThan(number: number, msg?: string): void
  toBeGreaterThanOrEqual(number: number, msg?: string): void
  toBeLessThan(number: number, msg?: string): void
  toBeLessThanOrEqual(number: number, msg?: string): void

  // mock calls
  toHaveBeenCalled(): void
  toHaveBeenCalledTimes(times: number): void
  toHaveBeenCalledWith(...args: any[]): void
  toHaveBeenLastCalledWith(...args: any[]): void
  toHaveBeenNthCalledWith(nth: number, ...args: any[]): void
  toHaveReturnedWith(expected: any): void
  toHaveReturned(): void
  toHaveLastReturnedWith(expected: any): void
  toHaveReturnedTimes(times: number): void
  toHaveNthReturnedWith(nth: number, expected: any): void

  not: Expected
  resolves: Expected
  rejects: Expected
}
```

[ghw badge]: https://img.shields.io/github/workflow/status/allain/expect/ci
[ghw link]: https://github.com/allain/expect/actions?query=workflow%3Aci
