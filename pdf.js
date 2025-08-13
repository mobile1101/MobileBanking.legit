const express = require('express');
const { isUser } = require('../middleware/auth');
const { generateUserPDF } = require('../utils/pdf_generator');
const router = express.Router();
router.get('/download', isUser, async (req,res)=> await generateUserPDF(req.session.user.id, res));
module.exports = router;
