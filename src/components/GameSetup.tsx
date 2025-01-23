import React from 'react';
import { Settings, Clock, User } from 'lucide-react';
import { GameMode, GameSettings, PieceColor } from '../types/chess';

interface GameSetupProps {
  onStart: (settings: GameSettings) => void;
}

export function GameSetup({ onStart }: GameSetupProps) {
  const [settings, setSettings] = React.useState<GameSettings>({
    playerColor: 'w',
    timeControl: 600, // 10 minutes
    gameMode: 'rapid'
  });

  const timeControls = {
    bullet: [
      { label: '1 min', value: 60 },
      { label: '2 min', value: 120 }
    ],
    blitz: [
      { label: '3 min', value: 180 },
      { label: '5 min', value: 300 }
    ],
    rapid: [
      { label: '10 min', value: 600 },
      { label: '15 min', value: 900 }
    ],
    classical: [
      { label: '30 min', value: 1800 },
      { label: '1 hour', value: 3600 }
    ]
  };

  return (
    <div className="bg-white/90 p-8 rounded-xl shadow-xl w-96">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6" />
        Game Settings
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Play as
          </label>
          <div className="flex gap-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg border ${
                settings.playerColor === 'w'
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSettings(s => ({ ...s, playerColor: 'w' }))}
            >
              White
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg border ${
                settings.playerColor === 'b'
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSettings(s => ({ ...s, playerColor: 'b' }))}
            >
              Black
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-2" />
            Game Mode
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={settings.gameMode}
            onChange={e => setSettings(s => ({
              ...s,
              gameMode: e.target.value as GameMode,
              timeControl: timeControls[e.target.value as GameMode][0].value
            }))}
          >
            <option value="bullet">Bullet</option>
            <option value="blitz">Blitz</option>
            <option value="rapid">Rapid</option>
            <option value="classical">Classical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Control
          </label>
          <div className="grid grid-cols-2 gap-2">
            {timeControls[settings.gameMode].map(({ label, value }) => (
              <button
                key={value}
                className={`py-2 px-4 rounded-lg border ${
                  settings.timeControl === value
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSettings(s => ({ ...s, timeControl: value }))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
          onClick={() => onStart(settings)}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}