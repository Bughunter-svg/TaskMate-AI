require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// --- Initialize ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// --- Middleware ---
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// --- Connect MongoDB ---
connectDB();

// --- Import Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/team', require('./routes/team'));
app.use('/api/ai', require('./routes/ai'));

app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/team', require('./routes/team'));
app.use('/api/ai', require('./routes/ai'));

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('🚀 TaskMate AI Backend is live and healthy!');
});

// --- Real-Time Tracking (Team Mode) ---
let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // when user comes online
  socket.on('userOnline', (data) => {
    onlineUsers[socket.id] = { ...data, socketId: socket.id };
    io.emit('onlineUsers', Object.values(onlineUsers));
  });

  // when user goes offline manually
  socket.on('userOffline', () => {
    delete onlineUsers[socket.id];
    io.emit('onlineUsers', Object.values(onlineUsers));
  });

  // when user disconnects (closes browser or crashes)
  socket.on('disconnect', () => {
    delete onlineUsers[socket.id];
    io.emit('onlineUsers', Object.values(onlineUsers));
    console.log('🔴 User disconnected:', socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
