const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    category: {
      type: String,
      enum: ["Personal", "Business"],
      default: "Personal",
    },
    assignee: { type: String, default: "You" },
    isShared: { type: Boolean, default: false },
    sharedWith: { type: String, default: "" },
    scheduledDate: { type: String, default: "" },
    scheduledTime: { type: String, default: "" },
    deadline: { type: String, default: "" },
    startedAt: { type: String, default: "" },
    progress: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    completedBy: { type: String, default: "" },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
