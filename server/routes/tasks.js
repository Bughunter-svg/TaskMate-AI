const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const { getUser, setUser } = require("../store/userStore");
const { loadUserData, saveUserData } = require("../config/googleDrive");

/* ---------------------------------
   Helper: normalize user state
---------------------------------- */
function normalizeUser(user, userId) {
  if (!user || typeof user !== "object") {
    return {
      userId,
      tasks: [],
      stats: {},
    };
  }

  if (!Array.isArray(user.tasks)) user.tasks = [];
  if (!user.stats || typeof user.stats !== "object") user.stats = {};

  return user;
}

/* ---------------------------------
   POST /api/tasks
   Add task (auto-hydrating)
---------------------------------- */
router.post("/", async (req, res) => {
  console.log("🔥 /api/tasks HIT", req.body);
  try {
    const { userId, title, description, scheduledAt, category } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        error: "userId and title are required",
      });
    }

    // Load from memory or Drive
    let user = getUser(userId);
    if (!user) {
      user = await loadUserData(userId);
    }

    // Normalize state (CRITICAL)
    user = normalizeUser(user, userId);

    const task = {
      id: crypto.randomUUID(),
      title,
      description: description || "",
      category: category || "general",
      status: "Pending",
      scheduledAt: scheduledAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      reschedules: 0,
    };

    user.tasks.push(task);

    user.stats.totalTasks = (user.stats.totalTasks || 0) + 1;
    user.stats.pendingTasks = (user.stats.pendingTasks || 0) + 1;

    // Update cache + persist
    setUser(userId, user);
    await saveUserData(userId, user);

    return res.status(201).json({
      success: true,
      task,
      userStats: user.stats,
    });
  } catch (err) {
    console.error("ADD TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to add task",
    });
  }
});

/* ---------------------------------
   GET /api/tasks/:userId
   Get all tasks (auto-hydrating)
---------------------------------- */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let user = getUser(userId);
    if (!user) {
      user = await loadUserData(userId);
    }

    user = normalizeUser(user, userId);
    setUser(userId, user);

    return res.json({
      success: true,
      tasks: user.tasks,
    });
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to load tasks",
    });
  }
});

/* ---------------------------------
   PUT /api/tasks/:taskId
   Update task (status / schedule)
---------------------------------- */
router.put("/:taskId", async (req, res) => {
  try {
    const { userId, ...updates } = req.body;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId required",
      });
    }

    let user = getUser(userId);
    if (!user) {
      user = await loadUserData(userId);
    }

    user = normalizeUser(user, userId);

    const task = user.tasks.find((t) => t.id === taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    Object.assign(task, updates);
    task.updatedAt = new Date().toISOString();

    if (updates.status === "Completed" && !task.completedAt) {
      task.completedAt = new Date().toISOString();
      user.stats.pendingTasks = Math.max(
        (user.stats.pendingTasks || 1) - 1,
        0
      );
      user.stats.completedTasks = (user.stats.completedTasks || 0) + 1;
    }

    setUser(userId, user);
    await saveUserData(userId, user);

    return res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to update task",
    });
  }
});

/* ---------------------------------
   DELETE /api/tasks/:taskId
---------------------------------- */
router.delete("/:taskId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId required",
      });
    }

    let user = getUser(userId);
    if (!user) {
      user = await loadUserData(userId);
    }

    user = normalizeUser(user, userId);

    const before = user.tasks.length;
    user.tasks = user.tasks.filter((t) => t.id !== taskId);

    if (user.tasks.length === before) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    setUser(userId, user);
    await saveUserData(userId, user);

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to delete task",
    });
  }
});

module.exports = router;
