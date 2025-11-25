require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const morgan = require("morgan");
const xss = require("xss-clean");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// --- Connect DB ---
connectDB();

// --- Security Middleware ---
const applySecurity = require("./middleware/security");
applySecurity(app);

// --- Core Middleware ---
app.use(xss());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());
app.use((req, res, next) => {
  req.io = io; // attach socket instance to all routes
  next();
});

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, slow down 🕒",
});
app.use(limiter);



// --- Routes ---
app.use(express.json());
const authMiddleware = require("./middleware/authMiddleware");
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/team", authMiddleware, require("./routes/team"));
app.use("/api/ai", require("./routes/ai")); // ✅ Gemini route

// --- Health Check ---
app.get("/", (req, res) => {
  res.status(200).send("🚀 TaskMate AI Backend is live & secure!");
});

// --- Real-time tracking (Socket.io) ---
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("userOnline", (data) => {
    onlineUsers[socket.id] = { ...data, socketId: socket.id };
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("userOffline", () => {
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));
    console.log("🔴 User disconnected:", socket.id);
  });
});

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error("🔥 Internal Server Error:", err.stack || err.message);
  res.status(500).json({
    success: false,
    error: "💥 Internal Server Error — Something went wrong!",
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🌐 Server running securely on port ${PORT}`);
});
