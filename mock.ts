const MOCK_SYMBOL = Symbol.for('@MOCK')

type MockCall = {
    args: any[],
    result: any,
    timestamp: number
}

export function fn(impl?: (...any) => any) {
    const calls: MockCall[] = []

    const f = (...args: any[]) => {
        const result = impl ? impl() : undefined
        calls.push({ args, result, timestamp: Date.now() })
        return result
    }

    Object.defineProperty(f, MOCK_SYMBOL, {
        value: { calls },
        writable: false,
    })

    return f
}

export function calls(f: Function): MockCall[] {
    const mockInfo = f[MOCK_SYMBOL]
    if (!mockInfo) throw new Error('callCount only available on mock functions')

    return [...mockInfo.calls]
}
