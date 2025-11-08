const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  username: { type: String, required: true },
  action: { type: String, required: true }, // e.g. "file_opened", "ai_chat", "login"
  duration: { type: Number, default: 0 },   // in minutes if applicable
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
