const PDFDocument = require('pdfkit');
const { get, all } = require('./db');
async function generateUserPDF(userId, res){
  const doc = new PDFDocument({ margin:50 });
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition','attachment; filename=statement.pdf');
  doc.pipe(res);
  // watermark
  doc.fontSize(60).fillColor('gray').opacity(0.08).text('MobileBanking.legit', 80, 250);
  doc.opacity(1);
  // cover
  doc.fillColor('red').fontSize(48).text('MBL', {align:'center'});
  doc.fillColor('gray').fontSize(20).text('MobileBanking.legit', {align:'center'});
  const user = await get('SELECT * FROM users WHERE id = ?', [userId]) || {};
  const now = new Date().toLocaleString();
  doc.moveDown();
  doc.fillColor('black').fontSize(12).text(`Statement Date: ${now}`, {align:'center'});
  doc.text(`Name: ${user.name||''}`, {align:'center'});
  doc.text(`Email: ${user.email||''}`, {align:'center'});
  doc.addPage();
  const transfers = await all('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  const loans = await all('SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  const crypto = await all('SELECT * FROM crypto_assets WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  doc.fontSize(16).text('Transfers', {underline:true});
  transfers.forEach(t=> doc.fontSize(12).text(`${t.updated_at} | $${(t.amount_cents/100).toFixed(2)} | ${t.currency} | ${t.status}`));
  doc.addPage();
  doc.fontSize(16).text('Loans', {underline:true});
  loans.forEach(l=> doc.fontSize(12).text(`${l.updated_at} | $${(l.principal_cents/100).toFixed(2)} | ${l.status}`));
  doc.addPage();
  doc.fontSize(16).text('Crypto', {underline:true});
  crypto.forEach(c=> doc.fontSize(12).text(`${c.updated_at} | ${c.symbol} | ${c.amount}`));
  doc.end();
}
module.exports = { generateUserPDF };
