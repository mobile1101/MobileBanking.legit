const express = require('express');
const { get, run } = require('../utils/db');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();
router.get('/live-chat', async (req,res)=>{ const row = await get('SELECT live_chat_script FROM settings WHERE id = 1'); res.json({script: row?.live_chat_script || ''}); });
router.post('/live-chat', isAdmin, async (req,res)=>{ await run('UPDATE settings SET live_chat_script=? WHERE id=1', [req.body.script || '']); res.json({success:true}); });
module.exports = router;
