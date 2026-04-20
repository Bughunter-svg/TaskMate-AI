process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const morgan = require("morgan");
const xss = require("xss-clean");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

/* =======================
   Database Connection
======================= */
const connectDB = require("./config/db");
connectDB();

/* =======================
   Security Middleware
======================= */
const applySecurity = require("./middleware/security");
applySecurity(app);

/* =======================
   Core Middleware
======================= */
app.use(express.json());
app.use(xss());
app.use(morgan("dev"));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps) or any localhost port
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      const allowed = process.env.FRONTEND_URL || 'http://localhost:3000';
      if (origin === allowed) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(helmet());

/* Attach socket.io to requests */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* =======================
   Rate Limiting
======================= */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* =======================
   Routes
======================= */
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/session", require("./routes/session"));
app.use("/api/team", authMiddleware, require("./routes/team"));
app.use("/api/ai", require("./routes/ai")); // Gemini route

/* =======================
   Health Check
======================= */
app.get("/", (req, res) => {
  res.status(200).send("TaskMate AI backend running");
});

/* =======================
   Socket.io
======================= */
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

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
    console.log("User disconnected:", socket.id);
  });
});

/* =======================
   Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

/* =======================
   Start Server
======================= */
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
