const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/loans');
const { requireAuth } = require('../middleware/auth');

router.post('/apply', requireAuth, ctrl.applyLoan);
router.get('/', requireAuth, ctrl.listLoans);

module.exports = router;
