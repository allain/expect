import { runTests, test } from "https://deno.land/std/testing/mod.ts";
import {
    assert,
    assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

import * as mock from './mock.ts'

test(function canMockFunctions() {
    assertEquals(typeof mock.fn(), 'function')
    const f = mock.fn()
    f(10)
    f(20)

    const calls = mock.calls(f)
    assert(Array.isArray(calls))
    assertEquals(calls.length, 2)
    assertEquals(calls.map(c => c.args), [[10], [20]])
    assertEquals(calls.map(c => c.result), [undefined, undefined])

    assert(calls.map(c => typeof c.timestamp).every(t => t === 'number'))
})

runTests()