const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

/* ---------------------------------
   POST /api/tasks
   Create a new task
---------------------------------- */
router.post("/", async (req, res) => {
  console.log("🔥 /api/tasks HIT", req.body);
  try {
    const {
      userId,
      title,
      description,
      category,
      assignee,
      isShared,
      sharedWith,
      scheduledDate,
      scheduledTime,
      deadline,
      startedAt,
      progress,
      imageUrl,
      priority,
      tags,
    } = req.body;

    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        error: "userId and title are required",
      });
    }

    const task = await Task.create({
      userId,
      title,
      description: description || "",
      category: category || "Personal",
      assignee: assignee || "You",
      isShared: isShared || false,
      sharedWith: sharedWith || "",
      scheduledDate: scheduledDate || "",
      scheduledTime: scheduledTime || "",
      deadline: deadline || "",
      startedAt: startedAt || "",
      progress: progress || 0,
      imageUrl: imageUrl || "",
      priority: priority || "Medium",
      tags: tags || [],
      status: "Pending",
    });

    // Return in the shape the frontend expects (id not _id)
    return res.status(201).json({
      success: true,
      task: formatTask(task),
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
   Get all tasks for a user
---------------------------------- */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      tasks: tasks.map(formatTask),
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
   Update a task
---------------------------------- */
router.put("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId, ...updates } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "userId required" });
    }

    if (updates.status === "Completed") {
      updates.completedAt = new Date();
      updates.completedBy = updates.completedBy || userId;
    }

    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.json({ success: true, task: formatTask(task) });
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
    const { taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "userId required" });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to delete task",
    });
  }
});

/* ---------------------------------
   Helper: format Mongoose doc for frontend
   Maps _id → id
---------------------------------- */
function formatTask(doc) {
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

module.exports = router;
