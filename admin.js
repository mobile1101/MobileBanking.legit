const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const admin = require('../controllers/admin');
const loans = require('../controllers/loans');

router.use(requireAuth, requireAdmin);
router.get('/users', admin.listUsers);
router.patch('/users/:id/balance', admin.updateBalance);
router.get('/transactions', admin.listTransactions);
router.post('/transactions/:id/approve', admin.approveTx);
router.post('/transactions/:id/reject', admin.rejectTx);
router.post('/transactions/:id/reverse', admin.reverseTx);

// loans admin
router.get('/loans', loans.adminListLoans);
router.post('/loans/:id/approve', loans.approveLoan);
router.post('/loans/:id/reject', loans.rejectLoan);

module.exports = router;
