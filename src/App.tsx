import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Brain, ChevronUp as ChevronUndo, Timer, Lightbulb, Trophy } from 'lucide-react';
import { Chessboard } from './components/Chessboard';
import { GameSetup } from './components/GameSetup';
import { ProfileDashboard } from './components/ProfileDashboard';
import { Board, Position, GameStatus, TimeControl, GameSettings, PlayerStats } from './types/chess';
import { getBestMove, isLegalMove, getGameStatus, makeMove } from './utils/chessEngine';

const initialBoard: Board = [
  [
    { type: 'r', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'q', color: 'b' },
    { type: 'k', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'r', color: 'b' },
  ],
  Array(8).fill({ type: 'p', color: 'b' }),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill({ type: 'p', color: 'w' }),
  [
    { type: 'r', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'q', color: 'w' },
    { type: 'k', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'r', color: 'w' },
  ],
];

// Mock player stats (in a real app, this would come from an API)
const mockPlayerStats: PlayerStats = {
  rating: 1850,
  wins: 142,
  losses: 98,
  draws: 34,
  recentGames: [
    {
      result: 'win',
      opponent: 'Magnus_Fan_2000',
      date: '2024-03-15',
      gameMode: 'rapid'
    },
    {
      result: 'loss',
      opponent: 'ChessWizard',
      date: '2024-03-14',
      gameMode: 'blitz'
    },
    {
      result: 'win',
      opponent: 'GrandmasterDreams',
      date: '2024-03-14',
      gameMode: 'bullet'
    },
    {
      result: 'draw',
      opponent: 'TacticalGenius',
      date: '2024-03-13',
      gameMode: 'rapid'
    }
  ]
};

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function App() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [thinking, setThinking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [time, setTime] = useState<TimeControl>({ white: 600, black: 600 });
  const [currentPlayer, setCurrentPlayer] = useState<'w' | 'b'>('w');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintMove, setHintMove] = useState<{ from: Position; to: Position } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameOver && gameStatus === 'playing' && gameStarted) {
      timer = setInterval(() => {
        setTime(prev => ({
          ...prev,
          [currentPlayer === 'w' ? 'white' : 'black']: prev[currentPlayer === 'w' ? 'white' : 'black'] - 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentPlayer, gameOver, gameStatus, gameStarted]);

  useEffect(() => {
    if (time.white <= 0) {
      setGameOver(true);
      setMessage('Black wins on time!');
    } else if (time.black <= 0) {
      setGameOver(true);
      setMessage('White wins on time!');
    }
  }, [time]);

  const handleGameStart = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setTime({ white: newSettings.timeControl, black: newSettings.timeControl });
    setCurrentPlayer(newSettings.playerColor);
    setGameStarted(true);
    
    if (newSettings.playerColor === 'b') {
      // AI makes the first move as white
      makeAIMove(board, 'w');
    }
  };

  const getHint = () => {
    setShowHint(true);
    const move = getBestMove(board, currentPlayer);
    setHintMove(move);
    setTimeout(() => {
      setShowHint(false);
      setHintMove(null);
    }, 2000);
  };

  const makeAIMove = (currentBoard: Board, aiColor: 'w' | 'b') => {
    setThinking(true);
    setTimeout(() => {
      const aiMove = getBestMove(currentBoard, aiColor);
      const finalBoard = makeMove(currentBoard, aiMove.from, aiMove.to);
      setBoard(finalBoard);
      
      const nextPlayer = aiColor === 'w' ? 'b' : 'w';
      const afterAiStatus = getGameStatus(finalBoard, nextPlayer);
      setGameStatus(afterAiStatus);
      setCurrentPlayer(nextPlayer);

      switch (afterAiStatus) {
        case 'check':
          setMessage(`${nextPlayer === 'w' ? 'White' : 'Black'} is in check!`);
          break;
        case 'checkmate':
          setMessage(`Checkmate! ${aiColor === 'w' ? 'White' : 'Black'} wins!`);
          setGameOver(true);
          break;
        case 'stalemate':
          setMessage('Stalemate! Game is drawn.');
          setGameOver(true);
          break;
        default:
          setMessage(null);
      }

      setThinking(false);
    }, 500);
  };

  const handleMove = (from: Position, to: Position) => {
    if (!gameStarted || gameOver) {
      setMessage(gameStarted ? 'Game is over! Start a new game.' : 'Please set up the game first.');
      return;
    }

    const piece = board[from.row][from.col];
    
    if (!piece || piece.color !== currentPlayer) {
      setMessage(`It's ${currentPlayer === 'w' ? 'white' : 'black'}'s turn!`);
      return;
    }

    if (!isLegalMove(board, from, to)) {
      setMessage('Invalid move!');
      return;
    }

    // Make the player's move
    const newBoard = makeMove(board, from, to);
    setBoard(newBoard);

    // Update game status
    const nextPlayer = currentPlayer === 'w' ? 'b' : 'w';
    const status = getGameStatus(newBoard, nextPlayer);
    setGameStatus(status);
    setCurrentPlayer(nextPlayer);

    // Clear previous messages and set new status message
    switch (status) {
      case 'check':
        setMessage(`${nextPlayer === 'w' ? 'White' : 'Black'} is in check!`);
        break;
      case 'checkmate':
        setMessage(`Checkmate! ${currentPlayer === 'w' ? 'White' : 'Black'} wins!`);
        setGameOver(true);
        return;
      case 'stalemate':
        setMessage('Stalemate! Game is drawn.');
        setGameOver(true);
        return;
      default:
        setMessage(null);
    }

    // AI move
    if (!gameOver && settings && nextPlayer !== settings.playerColor) {
      makeAIMove(newBoard, nextPlayer);
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setMessage(null);
    setGameStatus('playing');
    setGameStarted(false);
    setSettings(null);
    setGameOver(false);
    setThinking(false);
    setShowHint(false);
    setHintMove(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-8"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80")',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundBlendMode: 'overlay'
        }}
      >
        {!gameStarted ? (
          <GameSetup onStart={handleGameStart} />
        ) : (
          <div className="bg-white/90 p-8 rounded-xl shadow-xl">
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
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  <div className="text-sm font-mono">
                    <div>White: {formatTime(time.white)}</div>
                    <div>Black: {formatTime(time.black)}</div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg flex items-center gap-2"
                  onClick={getHint}
                  disabled={thinking || gameOver}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2"
                  onClick={resetGame}
                >
                  <ChevronUndo className="w-4 h-4" />
                  New Game
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Chessboard 
                board={board} 
                onMove={handleMove}
                highlightMove={showHint ? hintMove : null}
              />
              {thinking && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            {message && (
              <div className={`mt-4 p-2 rounded-lg text-center ${
                message.includes('wins') || message.includes('Checkmate')
                  ? 'bg-green-100 text-green-800'
                  : message.includes('check')
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {message}
              </div>
            )}
            
            <div className="mt-6 text-sm text-gray-600">
              <p>
                {settings?.gameMode.charAt(0).toUpperCase() + settings?.gameMode.slice(1)} game
                {' • '}
                Playing as {settings?.playerColor === 'w' ? 'White' : 'Black'}
                {' • '}
                {formatTime(settings?.timeControl || 0)} per side
              </p>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <ProfileDashboard
              stats={mockPlayerStats}
              onClose={() => setShowProfile(false)}
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;