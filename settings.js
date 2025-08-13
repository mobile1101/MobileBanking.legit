
const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { isAdmin } = require('../middleware/auth');

// Save live chat script
router.post('/live-chat', isAdmin, async (req, res) => {
    const { script } = req.body;
    await db.run("UPDATE settings SET live_chat_script = ? WHERE id = 1", [script]);
    res.json({ success: true });
});

// Get live chat script
router.get('/live-chat', async (req, res) => {
    const row = await db.get("SELECT live_chat_script FROM settings WHERE id = 1");
    res.json({ script: row ? row.live_chat_script : '' });
});

module.exports = router;
