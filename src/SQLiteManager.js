const fs = require('fs');
const path = require('path');

class SQLiteManager {
  constructor(databasePath = './data/omok.db') {
    this.databasePath = databasePath;
    this.jsonFallback = path.join(path.dirname(databasePath), 'history.json');
    this.ensureDir();
    this.mode = 'json';
    try {
      // Lazy require to allow environments without native build tools.
      // eslint-disable-next-line global-require, import/no-extraneous-dependencies
      const Database = require('better-sqlite3');
      this.db = new Database(this.databasePath);
      this.db.pragma('journal_mode = WAL');
      this.db
        .prepare(
          `CREATE TABLE IF NOT EXISTS game_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            result TEXT CHECK(result IN ('win','lose','draw')),
            moves INTEGER,
            duration INTEGER
          )`,
        )
        .run();
      this.mode = 'sqlite';
    } catch (e) {
      this.mode = 'json';
    }
  }

  ensureDir() {
    const dir = path.dirname(this.databasePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  async saveResult(entry) {
    if (this.mode === 'sqlite') {
      const stmt = this.db.prepare(
        'INSERT INTO game_history (date, result, moves, duration) VALUES (@date, @result, @moves, @duration)',
      );
      stmt.run(entry);
      return true;
    }
    const list = (await this.getHistory()).concat(entry);
    fs.writeFileSync(this.jsonFallback, JSON.stringify(list, null, 2));
    return true;
  }

  async getHistory(limit = 100) {
    if (this.mode === 'sqlite') {
      const rows = this.db
        .prepare('SELECT date, result, moves, duration FROM game_history ORDER BY id DESC LIMIT ?')
        .all(limit);
      return rows;
    }
    try {
      const raw = fs.readFileSync(this.jsonFallback, 'utf8');
      const arr = JSON.parse(raw);
      return arr.slice(-limit).reverse();
    } catch (_) {
      return [];
    }
  }
}

module.exports = { SQLiteManager };
