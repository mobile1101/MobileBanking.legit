const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notifications');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, ctrl.list);

module.exports = router;
