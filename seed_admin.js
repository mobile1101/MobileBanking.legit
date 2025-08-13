const bcrypt = require('bcrypt');
const { db } = require('./db');

async function ensureAdminSeed() {
  const email = process.env.ADMIN_EMAIL || 'admin@mobilebanking.legit';
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  const now = new Date().toISOString();
  if (!existing) {
    const hash = await bcrypt.hash(password, 12);
    db.prepare(`INSERT INTO users (email, password_hash, full_name, role, balance_cents, created_at, updated_at)
                VALUES (?, ?, ?, 'admin', 0, ?, ?)`)
      .run(email, hash, 'Administrator', now, now);
    console.log('Seeded admin user:', email);
  } else {
    console.log('Admin exists:', email);
  }
}

module.exports = { ensureAdminSeed };
