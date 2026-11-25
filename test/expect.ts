import assert from 'node:assert/strict';

type AsyncExpect = {
  rejects: {
    toBeInstanceOf(ctor: new (...args: never[]) => Error): Promise<void>;
  };
};

export function expect(actual: unknown, label = ''): {
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toBeTruthy(): void;
  toBeUndefined(): void;
  toBeGreaterThan(n: number): void;
  toBeGreaterThanOrEqual(n: number): void;
  toHaveLength(n: number): void;
  toContain(expected: unknown): void;
  toMatch(re: RegExp): void;
  toMatchObject(partial: Record<string, unknown>): void;
  toBeInstanceOf(ctor: abstract new (...args: never[]) => unknown): void;
  not: { toMatch(re: RegExp): void; toContain(expected: string): void };
} & AsyncExpect {
  const where = label ? ` (${label})` : '';
  return {
    toBe(expected) { assert.equal(actual, expected, where); },
    toEqual(expected) { assert.deepEqual(actual, expected, where); },
    toBeTruthy() { assert.ok(actual, where); },
    toBeUndefined() { assert.equal(actual, undefined, where); },
    toBeGreaterThan(n) { assert.ok(typeof actual === 'number' && actual > n, where); },
    toBeGreaterThanOrEqual(n) { assert.ok(typeof actual === 'number' && actual >= n, `${actual} >= ${n}${where}`); },
    toHaveLength(n) { assert.equal((actual as { length: number }).length, n, where); },
    toContain(expected) {
      if (typeof actual === 'string') assert.ok(actual.includes(String(expected)), `${actual} missing ${expected}${where}`);
      else assert.ok(Array.isArray(actual) && actual.includes(expected), `${JSON.stringify(actual)} missing ${expected}${where}`);
    },
    toMatch(re) { assert.match(String(actual), re, where); },
    toMatchObject(partial) {
      assert.equal(typeof actual, 'object');
      for (const [k, v] of Object.entries(partial)) assert.deepEqual((actual as Record<string, unknown>)[k], v, k + where);
    },
    toBeInstanceOf(ctor) { assert.ok(actual instanceof ctor, where); },
    not: {
      toMatch(re) { assert.doesNotMatch(String(actual), re, where); },
      toContain(expected) { assert.ok(!(actual as string).includes(expected), where); },
    },
    rejects: {
      async toBeInstanceOf(ctor) {
        await assert.rejects(actual as Promise<unknown>, (err: unknown) => err instanceof ctor);
      },
    },
  };
}
