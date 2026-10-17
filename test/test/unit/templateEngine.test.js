import { test, describe } from 'node:test';
import assert from 'node:assert';
import { applyTemplate, extractEventData, getEventAction } from '../../src/utils/templateEngine.js';

const REPO = 'Juin226/activity-log';
const DATE = '2026-10-18T12:00:00Z';

describe('applyTemplate', () => {
  test('returns null for invalid template', () => {
    assert.strictEqual(applyTemplate(null, {}), null);
  });
  test('replaces placeholders', () => {
    assert.strictEqual(
      applyTemplate('{emoji} {action} {repo}', { emoji: '⭐', action: 'Starred', repo: REPO }),
      `⭐ Starred ${REPO}`);
  });
  test('removes broken link when url is empty', () => {
    assert.strictEqual(applyTemplate('[{repo}]({url})', { repo: REPO }), REPO);
  });
});

describe('getEventAction', () => {
  test('merged PR', () => {
    assert.strictEqual(getEventAction('PullRequestEvent', { action: 'closed', pull_request: { merged: true } }), 'merged');
  });
  test('default actions', () => {
    assert.strictEqual(getEventAction('PushEvent', {}), 'committed');
    assert.strictEqual(getEventAction('UnknownEvent', {}), 'performed action');
  });
});

describe('extractEventData', () => {
  test('public PushEvent', () => {
    const d = extractEventData({ type: 'PushEvent', public: true, repo: { name: REPO }, created_at: DATE,
      payload: { ref: 'refs/heads/master', head: 'abc123' } }, { PushEvent: '📝' });
    assert.strictEqual(d.emoji, '📝');
    assert.strictEqual(d.ref, 'master');
    assert.strictEqual(d.url, `https://github.com/${REPO}/commit/abc123`);
  });
  test('private event hides details', () => {
    const d = extractEventData({ type: 'PushEvent', public: false, repo: { name: REPO }, created_at: DATE,
      payload: { ref: 'refs/heads/master', head: 'abc123' } }, {}, true);
    assert.strictEqual(d.repo, 'a private repository');
    assert.strictEqual(d.url, '');
  });
});
