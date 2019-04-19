import {
  assert,
  assertStrictEq
} from "https://deno.land/std/testing/asserts.ts";

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertionError";
  }
}

interface IExpected {
  toBe(candidate: any, msg?: string): void;
  toEqual(candidate: any, msg?: string): void;
  toBeTruthy(msg?: string): void;
  toBeFalsy(msg?: string): void;
  toBeDefined(msg?: string): void;

  // comparison
  toBeGreaterThan(number: number, msg?: string): void;
  toBeGreaterThanOrEqual(number: number, msg?: string): void;
  toBeLessThan(number: number, msg?: string): void;
  toBeLessThanOrEqual(number: number, msg?: string): void;

  not: IExpected;
  resolves: IAsyncExpected;
}

interface IAsyncExpected {
  toBe(candidate: any, msg?: string): Promise<void>;
  toEqual(candidate: any, msg?: string): Promise<void>;
  toBeTruthy(msg?: string): Promise<void>;
  toBeFalsy(msg?: string): Promise<void>;
  toBeDefined(msg?: string): Promise<void>;

  toBeGreaterThan(number:number, msg?: string): Promise<void>;
  toBeGreaterThanOrEqual(number:number, msg?: string): Promise<void>;
  toBeLessThan(number:number, msg?: string): Promise<void>;
  toBeLessThanOrEqual(number:number, msg?: string): Promise<void>;

  not: IAsyncExpected;
}

class Expected implements IExpected {
  private value: any;
  private notted: boolean;

  constructor(value: any, notted: boolean = false) {
    this.value = value;
    this.notted = notted;
  }

  public toBe(candidate: any, msg?: string): void {
    if (this.notted) {
      if (this.value === candidate) throw new AssertionError(msg);
    } else {
      if (this.value !== candidate) throw new AssertionError(msg);
    }
  }

  public toEqual(candidate: any, msg?: string): void {
    if (this.notted) {
      if (same(this.value, candidate)) throw new AssertionError(msg);
    } else {
      if (!same(this.value, candidate)) throw new AssertionError(msg);
    }
  }

  public toBeGreaterThan(number: number, msg?: string): void {
    if (this.notted) {
      if (this.value > number) throw new AssertionError(msg);
    } else {
      if (this.value <= number) throw new AssertionError(msg);
    }
  }
  
  public toBeLessThan(number: number, msg?: string): void {
    if (this.notted) {
      if (this.value < number) throw new AssertionError(msg);
    } else {
      if (this.value >= number) throw new AssertionError(msg);
    }
  }
  
  public toBeGreaterThanOrEqual(number: number, msg?: string): void {
    if (this.notted) {
      if (this.value >= number) throw new AssertionError(msg);
    } else {
      if (this.value < number) throw new AssertionError(msg);
    }
  }
  
  public toBeLessThanOrEqual(number: number, msg?: string): void {
    if (this.notted) {
      if (this.value <= number) throw new AssertionError(msg);
    } else {
      if (this.value > number) throw new AssertionError(msg);
    }
  }


  public toBeTruthy(msg?: string): void {
    if (this.notted ? this.value : !this.value) throw new AssertionError(msg);
  }

  public toBeFalsy(msg?: string): void {
    if (this.notted ? !this.value : this.value) throw new AssertionError(msg);
  }

  public toBeDefined(msg?: string): void {
    if (
      (typeof this.value === "undefined" && !this.notted) ||
      (typeof this.value !== "undefined" && this.notted)
    )
      throw new AssertionError(msg);
  }

  public get not(): IExpected {
    return new Expected(this.value, !this.notted);
  }

  public get resolves(): IAsyncExpected {
    if (!(this.value instanceof Promise))
      throw new AssertionError("expected value must be a Promise");

    return new AsyncExpected(this.value, this.notted);
  }

  public get rejects(): IAsyncExpected {
    if (!(this.value instanceof Promise))
      throw new AssertionError("expected value must be a Promise");

    const rejected = this.value.then(
      value => {
        throw new AssertionError(
          `Promise did not reject. resolved to ${value}`
        );
      },
      err => err
    );

    return new Expected(rejected, this.notted).resolves;
  }
}

function same(a: any, b: any): boolean {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => same(val, b[index]));
  } else if (Array.isArray(a)) {
    return false;
  } else if (Array.isArray(b)) {
    return false;
  } else if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    return same(aKeys, bKeys) && aKeys.every(aKey => same(a[aKey], b[aKey]));
  } else {
    return a === b;
  }
}

export function expect(value: any): Expected {
  return new Expected(value);
}

class AsyncExpected implements IAsyncExpected {
  private value: Promise<any>
  private notted: boolean

  constructor(value, notted) {
    this.value = value;
    this.notted = notted;
  }

  private get expected() : Promise<Expected> {
    return this.value.then(value => new Expected(value, this.notted));
  }

  async toBe(candidate: any, msg?: string) {
    (await this.expected).toBe(candidate, msg);
  }
  async toEqual(candidate: any, msg?: string) {
    (await this.expected).toEqual(candidate, msg);
  }
  async toBeTruthy(msg?: string) {
    (await this.expected).toBeTruthy(msg);
  }
  async toBeFalsy(msg?: string) {
    (await this.expected).toBeFalsy(msg);
  }
  async toBeDefined(msg?: string) {
    (await this.expected).toBeDefined(msg);
  }
  async toBeGreaterThan(number: number, msg?: string) {
    (await this.expected).toBeGreaterThan(number, msg);
  }
  async toBeLessThan(number: number, msg?: string) {
    (await this.expected).toBeLessThan(number, msg);
  }
  async toBeGreaterThanOrEqual(number: number, msg?: string) {
    (await this.expected).toBeGreaterThanOrEqual(number, msg);
  }
  async toBeLessThanOrEqual(number: number, msg?: string) {
    (await this.expected).toBeLessThanOrEqual(number, msg);
  }
  get not() {
    return new Expected(this.value, !this.notted).resolves;
  }
}
