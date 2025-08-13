const express = require('express');
const bcrypt = require('bcryptjs');
const { run, get } = require('../utils/db');
const { sendAlert } = require('../utils/email_alerts');
const router = express.Router();
router.post('/register', async (req,res)=>{
  const { name, email, password } = req.body;
  if(!name||!email||!password) return res.status(400).json({error:'Missing fields'});
  const hash = await bcrypt.hash(password,12);
  const now = new Date().toISOString();
  try{ await run('INSERT INTO users(name,email,passwordHash,created_at,updated_at) VALUES(?,?,?,?,?)',[name,email,hash,now,now]); await sendAlert('New Registration', `<b>${email}</b> registered at ${now}`); res.json({success:true}); }
  catch(e){ res.status(400).json({error:e.message}); }
});
router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const user = await get('SELECT * FROM users WHERE email = ?', [email]);
  if(!user) return res.status(401).json({error:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if(!ok) return res.status(401).json({error:'Invalid credentials'});
  req.session.user = { id:user.id, email:user.email, name:user.name };
  const now = new Date().toISOString();
  await run('UPDATE users SET last_login_at=?, updated_at=? WHERE id=?', [now, now, user.id]);
  await sendAlert('User Login', `<b>${user.email}</b> logged in at ${now}`);
  res.json({success:true});
});
router.post('/logout',(req,res)=>{ req.session.destroy(()=>res.json({success:true})); });
module.exports = router;
