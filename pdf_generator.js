
const PDFDocument = require('pdfkit');
const db = require('../utils/db');

async function generateUserPDF(userId, res) {
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');
    doc.pipe(res);

    // Watermark
    const watermarkText = 'MobileBanking.legit';
    doc.fontSize(50).fillColor('gray').opacity(0.1).text(watermarkText, 100, 300, { angle: 0, align: 'center' });
    doc.opacity(1);

    // Cover page branding
    doc.fillColor('red').fontSize(48).text('MBL', { align: 'center' });
    doc.fillColor('gray').fontSize(20).text('MobileBanking.legit', { align: 'center' });
    doc.moveDown();
    const user = await db.get("SELECT * FROM users WHERE id = ?", [userId]);
    const date = new Date().toLocaleString();
    doc.fontSize(14).fillColor('black').text(`Statement Date: ${date}`, { align: 'center' });
    doc.text(`Name: ${user.name || ''}`, { align: 'center' });
    doc.text(`Email: ${user.email}`, { align: 'center' });

    doc.addPage();

    // Transactions
    const transfers = await db.all("SELECT * FROM transactions WHERE user_id = ?", [userId]);
    const loans = await db.all("SELECT * FROM loans WHERE user_id = ?", [userId]);
    const crypto = await db.all("SELECT * FROM crypto WHERE user_id = ?", [userId]);

    doc.fontSize(16).fillColor('black').text('Transfers', { underline: true });
    transfers.forEach(t => {
        doc.fontSize(12).text(`${t.date} | ${t.type} | $${t.amount} | ${t.status}`);
    });
    doc.moveDown();

    doc.fontSize(16).text('Loans', { underline: true });
    loans.forEach(l => {
        doc.fontSize(12).text(`${l.date} | $${l.amount} | ${l.status}`);
    });
    doc.moveDown();

    doc.fontSize(16).text('Crypto', { underline: true });
    crypto.forEach(c => {
        doc.fontSize(12).text(`${c.date} | ${c.symbol} | ${c.amount}`);
    });

    doc.end();
}

module.exports = { generateUserPDF };
