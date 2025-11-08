const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI not found in .env file!");
    process.exit(1);
  }

  try {
    // disable SSL completely for local use
    await mongoose.connect(uri, {
      ssl: false
    });

    console.log("✅ MongoDB Connected Successfully (SSL disabled for local dev)");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:");
    console.error("🧩 Error Message:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
