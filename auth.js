const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth');
const { requireAuth } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/logout', requireAuth, ctrl.logout);
router.get('/me', ctrl.me);

module.exports = router;
