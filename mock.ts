const MOCK_SYMBOL = Symbol.for("@MOCK");

export type MockCall = {
  args: any[];
  returned?: any;
  thrown?: any;
  timestamp: number;
  returns: boolean;
  throws: boolean;
};

export function fn(name: string, ...stubs: Function[]): Function;
export function fn(...stubs: Function[]): Function;
export function fn(...mockArgs: any[]) {
  let stubs: Function[];
  let name = "f";
  if (typeof mockArgs[0] === "string") {
    name = mockArgs[0];
    stubs = mockArgs.slice(1);
  } else {
    stubs = mockArgs;
  }
  const calls: MockCall[] = [];

  // the name of the method will be used as the name of the mocked function
  const obj = {
    [name](...args: any[]) {
      const stub =
        stubs.length === 1
          ? // keep reusing the first
            stubs[0]
          : // pick the exact mock for the current call
            stubs[calls.length];

      try {
        const returned = stub ? stub(...args) : undefined;
        calls.push({
          args,
          returned,
          timestamp: Date.now(),
          returns: true,
          throws: false,
        });
        return returned;
      } catch (err) {
        calls.push({
          args,
          timestamp: Date.now(),
          returns: false,
          thrown: err,
          throws: true,
        });
        throw err;
      }
    },
  };
  const f = obj[name];

  Object.defineProperty(f, MOCK_SYMBOL, {
    value: { calls },
    writable: false,
  });

  return f;
}

export function calls(f: Function): MockCall[] {
  const mockInfo = (f as any)[MOCK_SYMBOL];
  if (!mockInfo) throw new Error("callCount only available on mock functions");

  return [...mockInfo.calls];
}
