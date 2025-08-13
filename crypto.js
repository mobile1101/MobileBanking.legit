const express = require('express');
const { run, all } = require('../utils/db');
const { isUser } = require('../middleware/auth');
const router = express.Router();
router.post('/add', isUser, async (req,res)=>{ const now=new Date().toISOString(); await run('INSERT INTO crypto_assets(user_id, symbol, amount, created_at, updated_at) VALUES(?,?,?,?)',[req.session.user.id, req.body.symbol, Number(req.body.amount), now, now]); res.json({success:true}); });
router.get('/my', isUser, async (req,res)=>{ const rows = await all('SELECT * FROM crypto_assets WHERE user_id = ? ORDER BY created_at DESC',[req.session.user.id]); res.json(rows); });
module.exports = router;
