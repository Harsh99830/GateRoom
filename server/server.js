const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Start cron jobs
const { startCronJobs } = require('./cron');
startCronJobs();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.io logic for WebRTC signaling
const botEngine = require('./bots/botEngine');
let waitingUsers = [];
const activeMatches = new Map();
const connectedUsers = new Map(); // Track all real connected users

botEngine.on('bot-joined', (bot) => {
  if (global.ioInstance) {
    global.ioInstance.to(bot.branch).emit('member-joined', { name: bot.name, branch: bot.branch });
  }
});

botEngine.on('bot-away', (bot) => {
  if (global.ioInstance) {
    global.ioInstance.to(bot.branch).emit('member-away', { name: bot.name });
  }
});

// Every 60 sec, emit updated bot list + real users to all connected clients
setInterval(() => {
  botEngine.setRealUserCount(connectedUsers.size);
  const activeBots = botEngine.getActiveBots();
  const realUsers = Array.from(connectedUsers.values());
  const mergedList = [...realUsers, ...activeBots];
  
  if (global.ioInstance) {
    global.ioInstance.emit('room-update', mergedList);
  }
}, 60000);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Set global io for interval/botEngine if not set
  if (!global.ioInstance) global.ioInstance = io;

  socket.on('join-queue', (profile) => {
    // Record real user for the network list
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: profile.name,
      branch: profile.branch,
      todayMinutes: 0, // Real user stats can be tracked here
      streak: 1
    });

    if (waitingUsers.length > 0) {
      // Match found
      const partner = waitingUsers.shift();
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      activeMatches.set(socket.id, { roomId, partnerSocketId: partner.socket.id });
      activeMatches.set(partner.socket.id, { roomId, partnerSocketId: socket.id });
      
      socket.emit('match-found', {
        roomId,
        partnerName: partner.profile.name,
        partnerBranch: partner.profile.branch,
        initiator: true
      });
      
      partner.socket.emit('match-found', {
        roomId,
        partnerName: profile.name,
        partnerBranch: profile.branch,
        initiator: false
      });
    } else {
      // Add to global queue
      waitingUsers.push({ socket, profile });
    }
  });

  socket.on('leave-queue', () => {
    waitingUsers = waitingUsers.filter(user => user.socket.id !== socket.id);
  });

  socket.on('join-room', (payload, userIdParam) => {
    if (typeof payload === 'object' && payload.branch) {
      const { branch, userId } = payload;
      socket.join(branch);
      socket.branchRoom = branch;
      socket.joinTime = Date.now();
      
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.to(branch).emit('member-joined', { name: user.name, branch });
      }
    } else {
      const roomId = payload;
      const userId = userIdParam;
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);
    }
  });

  socket.on('leave-room', (payload) => {
    if (typeof payload === 'object' && payload.branch) {
      const { branch, userId } = payload;
      socket.leave(branch);
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.to(branch).emit('member-away', { name: user.name });
      }
      
      if (socket.joinTime) {
        const sessionMinutes = Math.floor((Date.now() - socket.joinTime) / 60000);
        console.log(`User left branch room after ${sessionMinutes} minutes`);
      }
      socket.branchRoom = null;
    }
  });

  // WebRTC signaling
  socket.on('webrtc-offer', (payload) => {
    socket.to(payload.roomId).emit('webrtc-offer', payload);
  });

  socket.on('webrtc-answer', (payload) => {
    socket.to(payload.roomId).emit('webrtc-answer', payload);
  });

  socket.on('webrtc-ice-candidate', (payload) => {
    socket.to(payload.roomId).emit('webrtc-ice-candidate', payload);
  });

  // Chat signaling
  socket.on('send-message', ({ roomId, text, senderName }) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.to(roomId).emit('receive-message', { text, senderName, timestamp });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.branchRoom) {
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.to(socket.branchRoom).emit('member-away', { name: user.name });
      }
    }

    // Remove from network tracking
    connectedUsers.delete(socket.id);

    // Remove from global queue
    waitingUsers = waitingUsers.filter(user => user.socket.id !== socket.id);
    
    // Notify partner if in an active match
    if (activeMatches.has(socket.id)) {
      const match = activeMatches.get(socket.id);
      io.to(match.partnerSocketId).emit('partner-disconnected');
      
      activeMatches.delete(socket.id);
      activeMatches.delete(match.partnerSocketId);
    }
  });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const studyRoutes = require('./routes/study');
app.use('/api/study', studyRoutes);

const badgeRoutes = require('./routes/badge');
app.use('/api/badge', badgeRoutes);

app.get('/api/room/:branch/count', (req, res) => {
  const branch = req.params.branch;
  const activeBots = botEngine.getActiveBots().filter(b => b.branch === branch);
  const realUsers = Array.from(connectedUsers.values()).filter(u => u.branch === branch);
  
  res.json({
    total: activeBots.length + realUsers.length,
    bots: activeBots.length,
    real: realUsers.length
  });
});

app.post('/api/room/checkin', (req, res) => {
  const { userId, branch } = req.body;
  res.json({ success: true, message: 'Checked in successfully' });
});

app.post('/api/room/checkout', (req, res) => {
  const { userId, sessionMinutes } = req.body;
  res.json({ success: true, message: 'Checked out successfully', sessionMinutes });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
