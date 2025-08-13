const express = require('express');
const bcrypt = require('bcryptjs');
const { all, get, run } = require('../utils/db');
const { isAdmin } = require('../middleware/auth');
const { sendAlert } = require('../utils/email_alerts');
const router = express.Router();
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const admin = await get('SELECT * FROM admins WHERE id = 1');
  if(!admin) return res.status(500).json({error:'Admin not seeded'});
  const okEmail = email === admin.email;
  const okPass = await bcrypt.compare(password, admin.passwordHash || '');
  if(!okEmail || !okPass) return res.status(401).json({error:'Invalid admin credentials'});
  req.session.admin = { email: admin.email };
  res.json({success:true});
});
router.post('/logout', isAdmin, (req,res)=>{ req.session.destroy(()=>res.json({success:true})); });
router.get('/users', isAdmin, async (req,res)=>{ const rows = await all('SELECT id,name,email,balance_cents,created_at,last_login_at FROM users'); res.json(rows); });
router.post('/users/:id/balance', isAdmin, async (req,res)=>{
  const { mode, amount } = req.body;
  const user = await get('SELECT * FROM users WHERE id = ?', [req.params.id]);
  if(!user) return res.status(404).json({error:'User not found'});
  let newBal = user.balance_cents || 0;
  if(mode==='set') newBal = Math.round(Number(amount)*100);
  if(mode==='add') newBal = newBal + Math.round(Number(amount)*100);
  await run('UPDATE users SET balance_cents=?, updated_at=? WHERE id=?',[newBal, new Date().toISOString(), user.id]);
  res.json({success:true, balance_cents:newBal});
});
router.get('/transactions', isAdmin, async (req,res)=>{ const rows = await all('SELECT * FROM transactions ORDER BY created_at DESC'); res.json(rows); });
router.post('/transactions/:id/status', isAdmin, async (req,res)=>{
  const { status } = req.body;
  const tx = await get('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
  if(!tx) return res.status(404).json({error:'TX not found'});
  await run('UPDATE transactions SET status=?, updated_at=?, approved_by=1 WHERE id=?',[status, new Date().toISOString(), tx.id]);
  if(status==='approved' || status==='Approved') {
    const user = await get('SELECT * FROM users WHERE id = ?', [tx.user_id]);
    const newBal = (user.balance_cents || 0) - tx.amount_cents;
    await run('UPDATE users SET balance_cents=? WHERE id=?', [newBal, user.id]);
    await sendAlert('Transfer Approved', `Approved $${(tx.amount_cents/100).toFixed(2)} for user ${user.email}`);
  }
  res.json({success:true});
});
router.post('/account', isAdmin, async (req,res)=>{
  const { email, password } = req.body;
  if(email) await run('UPDATE admins SET email=? WHERE id=1',[email]);
  if(password){ const h = await require('bcryptjs').hash(password,12); await run('UPDATE admins SET passwordHash=? WHERE id=1',[h]); }
  res.json({success:true, updated: ['email','password'].filter(k=>req.body[k])});
});
module.exports = router;
