# MobileBanking.legit

A sleek, responsive banking-style web app with:
- Admin panel (approve/fail/reverse transfers, adjust balances)
- User accounts, transfers with **pending** status until admin approval
- Timestamps for register/login/transfer
- Notifications panel for admin (registrations, logins, transfers)
- Loans (user apply; admin approve/reject)
- Crypto asset ledger per user
- Live chat placeholder (paste any provider script)
- Mobile-friendly design (iPhone ready)

> ⚠️ Important: This is a **starter** for educational purposes. Real money/payment/crypto functionality is **not** integrated.
> Operating a real financial service requires strong security, audits, and regulatory compliance. Use at your own risk.

## Quick start

```bash
# 1) Install
npm install

# 2) Configure (optional)
cp .env.example .env
# edit ADMIN_EMAIL / ADMIN_PASSWORD and secrets

# 3) Run
npm run start
# visit http://localhost:3000
```

Default admin is taken from `.env` or:
- Email: `admin@mobilebanking.legit`
- Password: `ChangeThisPassword123!`

## Deploy

- You can push this code to GitHub (it includes `public/index.html` for GitHub views).
- For hosting the **server** (required for login, transfers, admin, etc.), use a Node host (Render, Railway, fly.io, VPS).
- GitHub Pages alone won't run the server-side code.

## Security Notes

- Uses `helmet`, sessions with `connect-sqlite3`, basic rate limiting, and hashed passwords via `bcrypt`.
- CSRF token is applied to admin page actions.
- Consider a production database (PostgreSQL), HTTPS, 2FA, audit logs, and professional security review before any real use.

## Live Chat

Open `public/index.html` and paste your vendor script where indicated:
```html
<!-- LIVE CHAT PLACEHOLDER -->
<div id="live-chat-placeholder"></div>
```

## License

MIT
