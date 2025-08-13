const { run } = require('./db');
async function initDB(){
  await run(`PRAGMA foreign_keys = ON;`);
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    passwordHash TEXT,
    balance_cents INTEGER DEFAULT 0,
    created_at TEXT,
    updated_at TEXT,
    last_login_at TEXT
  );`);
  await run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT,
    amount_cents INTEGER,
    currency TEXT,
    counterparty TEXT,
    status TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);
  await run(`CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    principal_cents INTEGER,
    currency TEXT,
    term_months INTEGER,
    apr REAL,
    status TEXT,
    created_at TEXT,
    updated_at TEXT
  );`);
  await run(`CREATE TABLE IF NOT EXISTS crypto_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    symbol TEXT,
    amount REAL,
    created_at TEXT,
    updated_at TEXT
  );`);
  await run(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, live_chat_script TEXT)`);
  await run(`INSERT OR IGNORE INTO settings(id, live_chat_script) VALUES(1, '')`);
  await run(`CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, email TEXT, passwordHash TEXT)`);
}
module.exports = { initDB };
