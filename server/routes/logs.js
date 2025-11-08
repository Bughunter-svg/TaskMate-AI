const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const authMiddleware = require("../middleware/authMiddleware"); // optional: protect routes

// 🟢 Add a new activity log
// Example body: { "username": "Harshu", "action": "ai_chat", "duration": 15 }
router.post("/", async (req, res) => {
  try {
    const { username, action, duration } = req.body;

    if (!username || !action) {
      return res.status(400).json({ success: false, error: "Username and action are required." });
    }

    const log = await ActivityLog.create({
      username,
      action,
      duration: duration || 0,
      timestamp: new Date(),
    });

    res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error("🔥 Error creating log:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// 🧾 Get all logs (sorted by newest first)
router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    console.error("🔥 Error fetching logs:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// 👤 Get all logs for a specific user
// Example: GET /api/logs/user/Harshu
router.get("/user/:username", async (req, res) => {
  try {
    const logs = await ActivityLog.find({ username: req.params.username }).sort({ timestamp: -1 });
    if (!logs.length) {
      return res.status(404).json({ success: false, error: "No logs found for this user." });
    }
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    console.error("🔥 Error fetching user logs:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// ❌ Delete all logs (admin/debug only)
router.delete("/clear", async (req, res) => {
  try {
    await ActivityLog.deleteMany({});
    res.json({ success: true, message: "All logs cleared successfully 🧹" });
  } catch (err) {
    console.error("🔥 Error clearing logs:", err.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
