const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

async function uploadFile(filePath, fileName, mimeType) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType
      },
      media: {
        mimeType,
        body: fs.createReadStream(filePath)
      }
    });
    console.log('✅ File uploaded:', response.data);
    return response.data;
  } catch (err) {
    console.error('❌ Drive Upload Failed:', err.message);
  }
}

module.exports = { uploadFile };
