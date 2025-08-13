const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT||'465',10),
  secure: (process.env.EMAIL_PORT||'465') === '465',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
async function sendAlert(subject, html){
  if(!process.env.EMAIL_USER) { console.log('No SMTP configured'); return; }
  try{ await transporter.sendMail({ from: `"MobileBanking" <${process.env.EMAIL_USER}>`, to: process.env.ADMIN_EMAIL, subject, html }); }
  catch(e){ console.error('sendAlert error', e.message); }
}
module.exports = { sendAlert };
