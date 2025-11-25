const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");

// Get all tasks for user
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    const { userId, title, description } = req.body;

    const newTask = await Task.create({ userId, title, description });
    await User.findByIdAndUpdate(userId, {
      $inc: { "stats.totalTasks": 1, "stats.pendingTasks": 1 },
    });

    const updatedUser = await User.findById(userId);
    req.io.emit("userStatsUpdated", updatedUser.stats);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Task creation failed" });
  }
});

// Update task status (Completed / In Progress)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const prevStatus = task.status;
    task.status = status;
    if (status === "Completed") task.completedAt = new Date();
    await task.save();

    const updates = {};
    if (prevStatus !== status) {
      updates[`stats.${prevStatus.toLowerCase()}Tasks`] = -1;
      updates[`stats.${status.toLowerCase()}Tasks`] = 1;
    }

    await User.findByIdAndUpdate(task.userId, { $inc: updates });
    const updatedUser = await User.findById(task.userId);

    req.io.emit("userStatsUpdated", updatedUser.stats);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

module.exports = router;
