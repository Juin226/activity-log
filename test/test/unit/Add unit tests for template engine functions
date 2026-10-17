import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';

const env = process.env.TEST_ENV ?? 'local';
console.log(`Integration tests, TEST_ENV = ${env}`);

test('dist/index.js exists', () => assert.ok(existsSync('dist/index.js')));
test('action.yml exists', () => assert.ok(existsSync('action.yml')));
test('TEST_ENV is valid', () => assert.ok(['local', 'staging', 'prod'].includes(env)));
