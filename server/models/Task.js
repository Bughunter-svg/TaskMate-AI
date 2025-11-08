const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  assignedTo: {
    type: String, // later can be user ID or username
    default: "unassigned"
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  estimatedTime: {
    type: Number, // in hours
    default: 0
  },
  timeSpent: {
    type: Number, // auto updated from team mode
    default: 0
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Task', TaskSchema);
