// server/services/driveStore.js
const fs = require("fs");

async function loadUser(userId) {
  // TODO: Google Drive API
  // For now, return local snapshot
  return {
    userId,
    tasks: [],
    stats: {}
  };
}

async function saveUser(userData) {
  // TODO: upload JSON to Drive
  return true;
}

module.exports = { loadUser, saveUser };
