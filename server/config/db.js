const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️  MONGO_URI not set — MongoDB features (auth) will be unavailable.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      family: 4, // Forces IPv4 (Fixes common Node.js connectivity issues)
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, 
    });

    console.log("✅ MongoDB Connected Successfully 🚀");

  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    // Only retry on initial connection failure, not on disconnects (Mongoose handles those)
    setTimeout(connectDB, 5000); 
  }
};

// Handle connection events for logging (Let Mongoose handle the actual reconnection)
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected. Mongoose is attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected!");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Error:", err);
});

module.exports = connectDB;
