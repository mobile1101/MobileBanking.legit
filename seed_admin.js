require('dotenv').config();
const bcrypt = require('bcryptjs');
const { run, get } = require('./db');
(async ()=>{
  const email = process.env.ADMIN_EMAIL || 'admin@mobilebanking.legit';
  const pass = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const hash = await bcrypt.hash(pass, 12);
  const existing = await get('SELECT * FROM admins WHERE id = 1') ;
  if(existing){
    await run('UPDATE admins SET email=?, passwordHash=? WHERE id=1', [email, hash]);
  } else {
    await run('INSERT INTO admins(id, email, passwordHash) VALUES(1, ?, ?)', [email, hash]);
  }
  console.log('Admin seeded');
  process.exit(0);
})();
