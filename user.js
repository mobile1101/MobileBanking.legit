const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user');
const { requireAuth } = require('../middleware/auth');

router.get('/transactions', requireAuth, ctrl.getTransactions);
router.post('/transfer', requireAuth, ctrl.createTransfer);

module.exports = router;
