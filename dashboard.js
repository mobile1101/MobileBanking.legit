async function fetchJSON(url, options={}) {
  const res = await fetch(url, Object.assign({ headers: { 'Content-Type':'application/json' }}, options));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function fmtCents(c) { return '$' + (c/100).toFixed(2); }

async function refreshMe() {
  const data = await fetchJSON('/api/auth/me');
  const box = document.getElementById('userBox');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!data.user) {
    box.textContent = 'Not logged in';
    logoutBtn.classList.add('d-none');
    return;
  }
  box.innerHTML = `<div class="fw-bold">${data.user.full_name}</div><div class="small text-muted">${data.user.email}</div>`;
  document.getElementById('balance').textContent = fmtCents(data.user.balance_cents);
  document.getElementById('timestamps').textContent = `Joined: ${data.user.created_at} • Updated: ${data.user.updated_at} • Last login: ${data.user.last_login_at || '—'}`;
  logoutBtn.classList.remove('d-none');
}

async function loadTx() {
  const data = await fetchJSON('/api/user/transactions');
  const body = document.querySelector('#txTable tbody');
  body.innerHTML = data.transactions.map(t => `<tr>
    <td>${t.id}</td><td>${t.type}</td><td>$${(t.amount_cents/100).toFixed(2)} ${t.currency}</td><td>${t.status}</td><td>${t.updated_at}</td>
  </tr>`).join('');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = Object.fromEntries(form.entries());
  await fetchJSON('/api/auth/register', { method:'POST', body: JSON.stringify(payload) });
  alert('Registered. Now log in.');
  e.target.reset();
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = Object.fromEntries(form.entries());
  await fetchJSON('/api/auth/login', { method:'POST', body: JSON.stringify(payload) });
  await refreshMe(); await loadTx();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetchJSON('/api/auth/logout', { method:'POST' });
  location.reload();
});

document.getElementById('transferForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = Object.fromEntries(form.entries());
  await fetchJSON('/api/user/transfer', { method:'POST', body: JSON.stringify(payload) });
  alert('Transfer submitted and is pending approval.');
  e.target.reset();
  await loadTx();
});

document.getElementById('loanForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = Object.fromEntries(form.entries());
  await fetchJSON('/api/loans/apply', { method:'POST', body: JSON.stringify(payload) });
  await loadLoans();
});

async function loadLoans() {
  const data = await fetchJSON('/api/loans');
  document.getElementById('loanList').innerHTML = data.loans.map(l => `
    <div class="border rounded p-2 mb-1 small">#${l.id}: $${(l.principal_cents/100).toFixed(2)} ${l.currency} • ${l.term_months}m @ ${l.apr}% • <span class="badge text-bg-secondary">${l.status}</span></div>
  `).join('') || '<div class="text-muted small">No loans yet.</div>';
}

document.getElementById('cryptoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const payload = Object.fromEntries(form.entries());
  await fetchJSON('/api/crypto', { method:'POST', body: JSON.stringify(payload) });
  await loadCrypto();
});

async function loadCrypto() {
  const data = await fetchJSON('/api/crypto');
  document.getElementById('cryptoList').innerHTML = data.assets.map(a => `
    <div class="border rounded p-2 mb-1 small">${a.symbol}: ${a.amount}</div>
  `).join('') || '<div class="text-muted small">No assets yet.</div>';
}

async function init() {
  try { await refreshMe(); await loadTx(); await loadLoans(); await loadCrypto(); } catch {}
}
init();
