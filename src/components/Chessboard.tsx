import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Board, Position, ChessTheme } from '../types/chess';

interface ChessboardProps {
  board: Board;
  onMove: (from: Position, to: Position) => void;
  highlightMove: { from: Position; to: Position } | null;
  theme?: ChessTheme;
  flipped?: boolean;
}

const PIECE_SYMBOLS = {
  k: { w: '♔', b: '♚' },
  q: { w: '♕', b: '♛' },
  r: { w: '♖', b: '♜' },
  b: { w: '♗', b: '♝' },
  n: { w: '♘', b: '♞' },
  p: { w: '♙', b: '♟' },
};

const Square: React.FC<{
  position: Position;
  piece: string | null;
  isBlack: boolean;
  onMove: (from: Position, to: Position) => void;
  isHighlighted?: boolean;
  isLastMove?: boolean;
  isValidMove?: boolean;
  theme: ChessTheme;
  flipped: boolean;
}> = ({
  position,
  piece,
  isBlack,
  onMove,
  isHighlighted,
  isLastMove,
  isValidMove,
  theme,
  flipped
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: { position },
    canDrag: () => piece !== null,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'piece',
    drop: (item: { position: Position }) => {
      onMove(item.position, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative w-16 h-16 flex items-center justify-center transition-all duration-200
        ${isBlack ? theme.darkSquare : theme.lightSquare}
        ${isOver ? theme.moveHint : ''}
        ${isDragging ? 'opacity-50' : ''}
        ${isHighlighted ? theme.highlight : ''}
        ${isLastMove ? 'ring-2 ring-yellow-400/50' : ''}
        ${isValidMove ? 'after:absolute after:w-4 after:h-4 after:rounded-full after:bg-gray-900/20' : ''}
      `}
      style={{
        transform: flipped ? 'rotate(180deg)' : 'none'
      }}
    >
      {piece && (
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            filter: isHovered ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none'
          }}
          className={`
            text-5xl cursor-move select-none transition-transform
            ${theme.pieces === 'neon'
              ? 'text-neon-piece drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]'
              : ''
            }
          `}
          style={{
            transform: flipped ? 'rotate(180deg)' : 'none',
            fontFamily: theme.pieces === 'modern' ? 'Arial Unicode MS' : 'serif'
          }}
        >
          {piece}
        </motion.div>
      )}
      
      {/* Coordinates */}
      {(position.col === 0 || position.row === 7) && (
        <div
          className={`
            absolute text-xs font-medium
            ${isBlack ? 'text-gray-300' : 'text-gray-700'}
            ${position.col === 0 ? 'left-1 top-1' : 'right-1 bottom-1'}
          `}
          style={{
            transform: flipped ? 'rotate(180deg)' : 'none'
          }}
        >
          {position.col === 0 && (flipped ? position.row + 1 : 8 - position.row)}
          {position.row === 7 && String.fromCharCode(97 + (flipped ? 7 - position.col : position.col))}
        </div>
      )}
    </div>
  );
};

export const Chessboard: React.FC<ChessboardProps> = ({
  board,
  onMove,
  highlightMove,
  theme = {
    name: 'Classic',
    lightSquare: 'bg-[#f0d9b5]',
    darkSquare: 'bg-[#b58863]',
    selected: 'ring-4 ring-blue-400',
    highlight: 'ring-4 ring-yellow-400',
    moveHint: 'bg-green-400/30',
    pieces: 'classic'
  },
  flipped = false
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Position; to: Position } | null>(null);

  const handleSquareClick = (position: Position) => {
    if (selectedSquare) {
      onMove(selectedSquare, position);
      setLastMove({ from: selectedSquare, to: position });
      setSelectedSquare(null);
      setValidMoves([]);
    } else if (board[position.row][position.col]) {
      setSelectedSquare(position);
      // Calculate valid moves here
      setValidMoves([/* Add valid moves calculation */]);
    }
  };

  const renderBoard = () => {
    let squares = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const row = flipped ? 7 - i : i;
        const col = flipped ? 7 - j : j;
        const position = { row, col };
        
        squares.push(
          <Square
            key={`${row}-${col}`}
            position={position}
            piece={board[row][col] ? getPieceSymbol(board[row][col]) : null}
            isBlack={(row + col) % 2 === 1}
            onMove={onMove}
            isHighlighted={
              highlightMove &&
              ((row === highlightMove.from.row && col === highlightMove.from.col) ||
               (row === highlightMove.to.row && col === highlightMove.to.col))
            }
            isLastMove={
              lastMove &&
              ((row === lastMove.from.row && col === lastMove.from.col) ||
               (row === lastMove.to.row && col === lastMove.to.col))
            }
            isValidMove={validMoves.some(move => move.row === row && move.col === col)}
            theme={theme}
            flipped={flipped}
          />
        );
      }
    }
    return squares;
  };

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{ rotate: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="grid grid-cols-8 border-2 border-gray-800 rounded-lg overflow-hidden shadow-2xl"
      >
        {renderBoard()}
      </motion.div>
    </div>
  );
};

function getPieceSymbol(piece: { type: string; color: string }): string {
  return PIECE_SYMBOLS[piece.type][piece.color as 'w' | 'b'];
}