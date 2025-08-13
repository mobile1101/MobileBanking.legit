const express = require('express');
const { run, all, get } = require('../utils/db');
const { isUser } = require('../middleware/auth');
const { sendAlert } = require('../utils/email_alerts');
const router = express.Router();
router.post('/transfer', isUser, async (req,res)=>{
  const { amount, currency='USD', counterparty } = req.body;
  const cents = Math.round(Number(amount)*100);
  const now = new Date().toISOString();
  const info = await run('INSERT INTO transactions(user_id,type,amount_cents,currency,counterparty,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)',[req.session.user.id,'transfer',cents,currency,counterparty||'','pending',now,now]);
  await sendAlert('New Transfer', `User ${req.session.user.email} initiated $${(cents/100).toFixed(2)} to ${counterparty||''} at ${now}`);
  res.json({success:true, id: info.lastID});
});
router.get('/history', isUser, async (req,res)=>{
  const rows = await all('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',[req.session.user.id]);
  res.json(rows);
});
module.exports = router;
