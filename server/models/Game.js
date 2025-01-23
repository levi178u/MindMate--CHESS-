import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  white: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  black: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  result: {
    type: String,
    enum: ['white', 'black', 'draw', 'ongoing'],
    default: 'ongoing'
  },
  moves: [{
    from: {
      row: Number,
      col: Number
    },
    to: {
      row: Number,
      col: Number
    },
    piece: String,
    timestamp: Date
  }],
  gameMode: {
    type: String,
    enum: ['bullet', 'blitz', 'rapid', 'classical'],
    required: true
  },
  timeControl: {
    initial: Number,
    increment: Number
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  pgn: String
}, {
  timestamps: true
});