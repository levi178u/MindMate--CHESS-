import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Timer, Lightbulb, Trophy, Settings } from 'lucide-react';
import { Chessboard } from './Chessboard';
import { GameSetup } from './GameSetup';
import { ProfileDashboard } from './ProfileDashboard';
import { TipsSection } from './TipsSection';
import { PuzzleMode } from './PuzzleMode';
import { useAI } from '../hooks/useAI';
import { useGameState } from '../hooks/useGameState';
import { Board, Position, GameStatus, TimeControl, GameSettings } from '../types/chess';

export function ChessGame() {
  const {
    board,
    currentPlayer,
    gameStatus,
    time,
    settings,
    makeMove,
    resetGame,
    getHint,
    isThinking
  } = useGameState();

  const { getBestMove, analyzePuzzle } = useAI();
  const [showProfile, setShowProfile] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      setMessage(
        gameStatus === 'checkmate'
          ? `Checkmate! ${currentPlayer === 'w' ? 'Black' : 'White'} wins!`
          : gameStatus === 'stalemate'
          ? 'Stalemate! Game is drawn.'
          : `${currentPlayer === 'w' ? 'White' : 'Black'} is in check!`
      );
    }
  }, [gameStatus, currentPlayer]);

  const handleMove = async (from: Position, to: Position) => {
    const result = await makeMove(from, to);
    if (!result.success) {
      setMessage(result.error);
      return;
    }

    if (settings?.gameMode === 'puzzle') {
      const analysis = await analyzePuzzle(board, from, to);
      setMessage(analysis.message);
    }
  };

  const handleHint = async () => {
    const hint = await getBestMove(board, currentPlayer);
    getHint(hint);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-8"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80")',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <AnimatePresence>
        {!settings ? (
          <GameSetup onStart={resetGame} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 p-8 rounded-xl shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Brain className="w-8 h-8" />
                Chess AI
              </h1>
              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg flex items-center gap-2"
                  onClick={() => setShowProfile(true)}
                >
                  <Trophy className="w-4 h-4" />
                  Profile
                </button>
                <button
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg flex items-center gap-2"
                  onClick={() => setShowTips(true)}
                >
                  <Settings className="w-4 h-4" />
                  Tips
                </button>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <div className="text-sm font-mono">
                    <div>White: {formatTime(time.white)}</div>
                    <div>Black: {formatTime(time.black)}</div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-2"
                  onClick={handleHint}
                  disabled={isThinking}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Chessboard 
                board={board}
                onMove={handleMove}
                flipped={settings.playerColor === 'b'}
              />
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/10 flex items-center justify-center"
                >
                  <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                    Thinking...
                  </div>
                </motion.div>
              )}
            </div>
            
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mt-4 p-2 rounded-lg text-center ${
                    message.includes('wins') || message.includes('Checkmate')
                      ? 'bg-green-100 text-green-800'
                      : message.includes('check')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {showProfile && (
        <ProfileDashboard onClose={() => setShowProfile(false)} />
      )}

      {showTips && (
        <TipsSection onClose={() => setShowTips(false)} />
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}