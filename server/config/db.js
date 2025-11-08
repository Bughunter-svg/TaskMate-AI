const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI not found in .env file!");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      ssl: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected Successfully 🚀");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    setTimeout(connectDB, 5000); // retry after 5s
  }
};

// Handle connection drops gracefully
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected, retrying in 5s...");
  setTimeout(connectDB, 5000);
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected!");
});

module.exports = connectDB;
