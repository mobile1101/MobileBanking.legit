require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { initDB } = require('./utils/init_db');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'change_me', resave:false, saveUninitialized:false }));
app.use(express.static(path.join(__dirname, 'public')));

initDB().catch(e=>console.error('init db error',e));

app.use('/auth', require('./routes/auth'));
app.use('/transactions', require('./routes/transactions'));
app.use('/admin', require('./routes/admin'));
app.use('/settings', require('./routes/settings'));
app.use('/pdf', require('./routes/pdf'));
app.use('/loans', require('./routes/loans'));
app.use('/crypto', require('./routes/crypto'));

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Server listening on', port));
