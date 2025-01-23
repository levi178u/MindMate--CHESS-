import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as tf from '@tensorflow/tfjs-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Load ML model
let model;
async function loadModel() {
  model = await tf.loadLayersModel('file://./ml/chess_model/model.json');
  console.log('ML model loaded');
}
loadModel();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

// MongoDB connection
mongoose.connect('mongodb://localhost/chess_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Socket.IO game handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_game', (gameId) => {
    socket.join(gameId);
  });

  socket.on('make_move', async (data) => {
    const { gameId, move, position } = data;
    
    // Analyze move with ML model
    const tensor = tf.tensor(position);
    const prediction = model.predict(tensor);
    const moveQuality = await prediction.data();
    
    io.to(gameId).emit('move_made', {
      move,
      analysis: {
        quality: moveQuality[0],
        suggestion: moveQuality[1]
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});