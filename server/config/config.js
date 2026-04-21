require('dotenv').config();
const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  }
};
module.exports = config;
