const { db } = require('./db');

// Create tables if not exist
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    balance_cents INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    last_login_at TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'transfer'
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    counterparty TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|failed|reversed
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    approved_by INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    principal_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    term_months INTEGER NOT NULL,
    apr REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|active|closed
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    approved_by INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS crypto_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    symbol TEXT NOT NULL, -- e.g., BTC, ETH
    amount REAL NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE(user_id, symbol),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT NOT NULL, -- register|login|transfer|loan
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    meta TEXT
  );
`);

module.exports = {};

// Settings table for live chat
db.run(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, live_chat_script TEXT)`);
db.run(`INSERT OR IGNORE INTO settings (id, live_chat_script) VALUES (1, '')`);
