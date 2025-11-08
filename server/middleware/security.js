// middleware/security.js
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const morgan = require('morgan');

const applySecurity = (app) => {
  // HTTP security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // API request logging
  app.use(morgan('dev'));

  // CORS setup
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

  // Rate limiting (anti DDoS)
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // max requests
    message: 'Too many requests, please try again later 🕒',
  });
  app.use(limiter);

  console.log('🛡️ Security middleware applied successfully.');
};

module.exports = applySecurity;
