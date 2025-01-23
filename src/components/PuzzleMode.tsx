import React, { useState, useEffect } from 'react';
import { Brain, Flag, Award } from 'lucide-react';
import { Board, PuzzleData, Position } from '../types/chess';
import { Chessboard } from './Chessboard';

interface PuzzleModeProps {
  onComplete: (success: boolean) => void;
  onExit: () => void;
}

export function PuzzleMode({ onComplete, onExit }: PuzzleModeProps) {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [currentMove, setCurrentMove] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    // In a real app, fetch from your Flask API
    fetchRandomPuzzle();
  }, []);

  const fetchRandomPuzzle = async () => {
    try {
      // This would be your Flask API endpoint
      const response = await fetch('http://localhost:5000/api/puzzles/random');
      const data = await response.json();
      setPuzzle(data);
      // Convert FEN to board state
      // setBoard(convertFenToBoard(data.fen));
    } catch (error) {
      console.error('Failed to fetch puzzle:', error);
    }
  };

  const handleMove = (from: Position, to: Position) => {
    if (!puzzle || currentMove >= puzzle.moves.length) return;

    const moveStr = `${from.row}${from.col}-${to.row}${to.col}`;
    if (moveStr === puzzle.moves[currentMove]) {
      setCurrentMove(prev => prev + 1);
      setMessage('Correct move! Keep going!');
      
      if (currentMove === puzzle.moves.length - 1) {
        setMessage('Puzzle completed successfully!');
        onComplete(true);
      }
    } else {
      setMessage('Incorrect move. Try again!');
      onComplete(false);
    }
  };

  if (!puzzle || !board) return <div>Loading puzzle...</div>;

  return (
    <div className="bg-white/90 p-8 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Chess Puzzle
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Rating: {puzzle.rating}</span>
          </div>
          <button
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg flex items-center gap-2"
            onClick={onExit}
          >
            <Flag className="w-4 h-4" />
            Give Up
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Puzzle Theme: {puzzle.theme.join(', ')}</h3>
          <p>{puzzle.description}</p>
        </div>
      </div>

      <div className="relative">
        <Chessboard
          board={board}
          onMove={handleMove}
          highlightMove={null}
        />
      </div>

      {message && (
        <div className={`mt-4 p-2 rounded-lg text-center ${
          message.includes('Correct') || message.includes('completed')
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}