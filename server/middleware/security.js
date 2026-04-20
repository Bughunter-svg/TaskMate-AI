// middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const morgan = require('morgan');

// Allow any localhost origin for development
const allowLocalhost = (origin, callback) => {
  if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
    return callback(null, true);
  }
  callback(new Error('Not allowed by CORS'));
};

const applySecurity = (app) => {
  // HTTP security headers (disable crossOriginResourcePolicy so HMR + API work together)
  app.use(helmet({ crossOriginResourcePolicy: false }));

  // Prevent XSS attacks
  app.use(xss());

  // API request logging
  app.use(morgan('dev'));

  // NOTE: CORS is intentionally NOT set here.
  // It is set once in index.js to avoid duplicate / conflicting headers.

  // Rate limiting (anti DDoS)
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200,
    message: 'Too many requests, please try again later 🕒',
  });
  app.use(limiter);

  console.log('🛡️ Security middleware applied successfully.');
};

module.exports = applySecurity;
