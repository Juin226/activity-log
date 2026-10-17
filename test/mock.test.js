import assert from 'node:assert';

console.log(`TEST_ENV = ${process.env.TEST_ENV ?? 'local'}`);
assert.strictEqual(1 + 1, 2);

if (process.env.SIMULATE_FAIL === 'true') {
  assert.strictEqual(1 + 1, 3, 'Simulated failure for demo');
}
console.log('✅ mock tests passed');
