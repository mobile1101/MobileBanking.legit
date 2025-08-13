
const express = require('express');
const router = express.Router();
const { isUser } = require('../middleware/auth');
const { generateUserPDF } = require('../utils/pdf_generator');

router.get('/download', isUser, async (req, res) => {
    await generateUserPDF(req.user.id, res);
});

module.exports = router;
