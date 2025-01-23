export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';
export type Piece = {
  type: PieceType;
  color: PieceColor;
};
export type Square = Piece | null;
export type Board = Square[][];
export type Position = {
  row: number;
  col: number;
};
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';
export type TimeControl = {
  white: number;
  black: number;
};

export type GameMode = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'puzzle';
export type GameSettings = {
  playerColor: PieceColor;
  timeControl: number;
  gameMode: GameMode;
  botDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'master';
  theme?: ChessTheme;
};

export type ChessTheme = {
  name: string;
  lightSquare: string;
  darkSquare: string;
  selected: string;
  highlight: string;
  moveHint: string;
  pieces: 'classic' | 'modern' | 'neon';
};

export type PlayerStats = {
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  puzzleRating: number;
  puzzlesSolved: number;
  recentGames: {
    result: 'win' | 'loss' | 'draw';
    opponent: string;
    date: string;
    gameMode: GameMode;
  }[];
};

export type PuzzleData = {
  id: string;
  fen: string;
  rating: number;
  moves: string[];
  theme: string[];
  description: string;
};

export type ChessTip = {
  id: string;
  category: 'opening' | 'middlegame' | 'endgame' | 'tactics' | 'strategy';
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};