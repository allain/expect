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
    assertEquals(calls.map(c => c.returned), [undefined, undefined])

    assert(calls.map(c => typeof c.timestamp).every(t => t === 'number'))
})

test(function mockFunctionTracksReturns() {
    const f = mock.fn(() => 1, () => { throw new Error('TEST') })
    f()
    f()
    const calls = mock.calls(f)
    assert(calls[0].returns)
    assert(!calls[0].throws)
    assert(!calls[1].returns)
    assert(calls[1].throws)
})
test(function mockFunctionCanHaveImplementations() {
    const f = mock.fn(n => n, n => n * 2, n => n * 3)
    f(1)
    f(1)
    f(1)
    f(1)
    f(1)

    const calls = mock.calls(f)
    assertEquals(calls.length, 5)
    assertEquals(calls.map(c => c.returned), [1, 2, 3, undefined, undefined])
})

runTests()