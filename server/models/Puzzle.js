import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema({
  fen: {
    type: String,
    required: true
  },
  moves: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    required: true
  },
  themes: [{
    type: String
  }],
  description: String,
  popularity: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  attempts: {
    type: Number,
    default: 0
  },
  source: String
});