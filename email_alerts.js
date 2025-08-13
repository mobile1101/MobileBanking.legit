
const nodemailer = require('nodemailer');

// Load env vars
require('dotenv').config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for others
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendAlert(subject, text) {
    try {
        await transporter.sendMail({
            from: `"MobileBanking Alerts" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_NOTIFY_EMAIL,
            subject: subject,
            text: text
        });
        console.log(`Alert sent: ${subject}`);
    } catch (err) {
        console.error("Error sending alert:", err);
    }
}

module.exports = { sendAlert };
