// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Your user schema
const Task = require("../models/Task"); // ✅ For dashboard stats

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, username, password: hashedPassword });

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // 🧠 Return user data with token
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- DASHBOARD DATA ---
router.get("/me/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const totalTasks = await Task.countDocuments({ username: req.params.username });
    const completedTasks = await Task.countDocuments({ username: req.params.username, status: "completed" });
    const inProgressTasks = await Task.countDocuments({ username: req.params.username, status: "in-progress" });

    res.json({
      success: true,
      user,
      stats: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks: totalTasks - (completedTasks + inProgressTasks),
      },
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
