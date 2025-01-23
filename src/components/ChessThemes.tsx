import React from 'react';
import { ChessTheme } from '../types/chess';

export const CHESS_THEMES: ChessTheme[] = [
  {
    name: 'Classic',
    lightSquare: 'bg-[#f0d9b5]',
    darkSquare: 'bg-[#b58863]',
    selected: 'ring-4 ring-blue-400',
    highlight: 'ring-4 ring-yellow-400',
    moveHint: 'bg-green-400/30',
    pieces: 'classic'
  },
  {
    name: 'Modern',
    lightSquare: 'bg-[#eeeed2]',
    darkSquare: 'bg-[#769656]',
    selected: 'ring-4 ring-blue-500',
    highlight: 'ring-4 ring-yellow-500',
    moveHint: 'bg-green-500/30',
    pieces: 'modern'
  },
  {
    name: 'Neon',
    lightSquare: 'bg-[#2c2c2c]',
    darkSquare: 'bg-[#1a1a1a]',
    selected: 'ring-4 ring-purple-500',
    highlight: 'ring-4 ring-cyan-500',
    moveHint: 'bg-pink-500/30',
    pieces: 'neon'
  }
];

interface ThemeSelectorProps {
  currentTheme: ChessTheme;
  onThemeChange: (theme: ChessTheme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="flex gap-4">
      {CHESS_THEMES.map((theme) => (
        <button
          key={theme.name}
          className={`p-2 rounded-lg ${
            currentTheme.name === theme.name
              ? 'ring-2 ring-blue-500'
              : 'hover:ring-2 hover:ring-gray-300'
          }`}
          onClick={() => onThemeChange(theme)}
        >
          <div className="grid grid-cols-2 w-16 h-16 rounded-md overflow-hidden">
            <div className={`${theme.lightSquare}`} />
            <div className={`${theme.darkSquare}`} />
            <div className={`${theme.darkSquare}`} />
            <div className={`${theme.lightSquare}`} />
          </div>
          <div className="text-sm mt-1 text-center">{theme.name}</div>
        </button>
      ))}
    </div>
  );
}