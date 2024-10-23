require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const bidRoutes = require('./routes/bids');
const projectRoutes = require('./routes/projects');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle new message
  socket.on('sendMessage', async ({ projectId, senderId, content }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        return socket.emit('error', 'Project not found');
      }

      project.messages.push({ sender: senderId, content });
      await project.save();

      // Emit the message to all clients connected to this project
      io.to(projectId).emit('newMessage', { projectId, senderId, content });
    } catch (error) {
      socket.emit('error', 'Could not send message');
    }
  });

  // Join a project room
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
  });

  // Leave a project room
  socket.on('leaveProject', (projectId) => {
    socket.leave(projectId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ... rest of the file ...
