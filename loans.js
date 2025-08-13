const express = require('express');
const { run, all } = require('../utils/db');
const { isUser } = require('../middleware/auth');
const router = express.Router();
router.post('/apply', isUser, async (req,res)=>{ const now=new Date().toISOString(); await run('INSERT INTO loans(user_id, principal_cents, currency, term_months, apr, status, created_at, updated_at) VALUES(?,?,?,?,?,?,?,?)',[req.session.user.id, Math.round(Number(req.body.amount)*100), 'USD', 12, 12, 'pending', now, now]); res.json({success:true}); });
router.get('/my', isUser, async (req,res)=>{ const rows = await all('SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC',[req.session.user.id]); res.json(rows); });
module.exports = router;
