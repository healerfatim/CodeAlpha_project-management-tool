

const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time updates
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);


// Basic route to test server
app.get('/', (req, res) => {
  res.send('Project Management API is running...');
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Example: Join a project room for task updates
  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});