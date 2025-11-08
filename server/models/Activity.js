const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  currentTask: {
    type: String,
    default: "Idle"
  },
  fileName: {
    type: String,
    default: "None"
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  online: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);
