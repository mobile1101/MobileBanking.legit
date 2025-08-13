require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');

const { db } = require('./utils/db');
const { ensureAdminSeed } = require('./utils/seed_admin');

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'", "https:"],
      "img-src": ["'self'", "data:", "https:"],
      "connect-src": ["'self'", "https:"],
      "frame-ancestors": ["'none'"]
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' },
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: 'data' })
}));

// Rate limiting (basic)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', authLimiter);

// CSRF protection for HTML form routes
const csrfProtection = csrf({ cookie: false });

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Views (for server-rendered pages like admin)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// Initialize DB tables
require('./utils/init_db');

// Ensure admin exists
ensureAdminSeed();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/crypto', require('./routes/crypto'));
app.use('/api/notifications', require('./routes/notifications'));

// Basic pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/admin', csrfProtection, (req, res) => res.render('admin.html', { csrfToken: req.csrfToken() }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
