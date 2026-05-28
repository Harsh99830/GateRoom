const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Socket.io logic for WebRTC signaling
let waitingUsers = [];
const activeMatches = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-queue', (profile) => {
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

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
