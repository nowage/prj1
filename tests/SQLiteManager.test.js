const fs = require('fs');
const path = require('path');
const os = require('os');
const { SQLiteManager } = require('../src/SQLiteManager');

test('SQLiteManager saves and retrieves history (backend-agnostic)', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'omok-db-'));
  const dbPath = path.join(tmp, 'test.db');
  const mgr = new SQLiteManager(dbPath);
  const entry = { date: '2024-01-01T00:00:00Z', result: 'win', moves: 42, duration: 120 };
  await mgr.saveResult(entry);
  const history = await mgr.getHistory(10);
  expect(history.length).toBeGreaterThan(0);
  const last = history[0];
  expect(last.result).toBe('win');
  expect(last.moves).toBe(42);
});

