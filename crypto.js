const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/crypto');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, ctrl.listAssets);
router.post('/', requireAuth, ctrl.upsertAsset);

module.exports = router;
