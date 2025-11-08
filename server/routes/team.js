const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

// 🟢 Get all team activity
router.get('/', async (req, res) => {
  try {
    const data = await Activity.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🟢 Mark user as online
router.post('/online', async (req, res) => {
  const { username, fileName, currentTask } = req.body;
  try {
    const activity = await Activity.findOneAndUpdate(
      { username },
      { online: true, fileName, currentTask, lastActive: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔴 Mark user as offline
router.post('/offline', async (req, res) => {
  const { username } = req.body;
  try {
    const activity = await Activity.findOneAndUpdate(
      { username },
      { online: false, lastActive: new Date() },
      { new: true }
    );
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ⏱️ Update time spent on a file
router.post('/time', async (req, res) => {
  const { username, minutes } = req.body;
  try {
    const activity = await Activity.findOneAndUpdate(
      { username },
      { $inc: { timeSpent: minutes }, lastActive: new Date() },
      { new: true }
    );
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
