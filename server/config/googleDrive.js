const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

const TMP_DIR = path.join(__dirname, "../tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

/* ------------------------
   Load user data
------------------------- */
async function loadUserData(userId) {
  try {
    const fileName = `${userId}.json`;

    const list = await drive.files.list({
      q: `name='${fileName}' and trashed=false`,
      fields: "files(id)",
    });

    if (!list.data.files.length) {
      return { userId, tasks: [], stats: {} };
    }

    const fileId = list.data.files[0].id;

    const res = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return await new Promise((resolve, reject) => {
      let data = "";
      res.data
        .on("data", (c) => (data += c))
        .on("end", () => resolve(JSON.parse(data)))
        .on("error", reject);
    });
  } catch (err) {
    console.error("DRIVE LOAD ERROR:", err.message);
    return { userId, tasks: [], stats: {} }; // fail SAFE
  }
}

/* ------------------------
   Save user data
------------------------- */
async function saveUserData(userId, userData) {
  const fileName = `${userId}.json`;
  const tmpPath = path.join(TMP_DIR, fileName);

  try {
    fs.writeFileSync(tmpPath, JSON.stringify(userData, null, 2));

    const list = await drive.files.list({
      q: `name='${fileName}' and trashed=false`,
      fields: "files(id)",
    });

    if (!list.data.files.length) {
      await drive.files.create({
        requestBody: { name: fileName, mimeType: "application/json" },
        media: {
          mimeType: "application/json",
          body: fs.createReadStream(tmpPath),
        },
      });
    } else {
      await drive.files.update({
        fileId: list.data.files[0].id,
        media: {
          mimeType: "application/json",
          body: fs.createReadStream(tmpPath),
        },
      });
    }
  } catch (err) {
    console.error("DRIVE SAVE ERROR:", err.message);
    // DO NOT throw — prevent server crash
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}

module.exports = { loadUserData, saveUserData };
