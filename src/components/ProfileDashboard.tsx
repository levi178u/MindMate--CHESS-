import React from 'react';
import { Trophy, TrendingUp, History, Award } from 'lucide-react';
import { PlayerStats, GameMode } from '../types/chess';

interface ProfileDashboardProps {
  stats: PlayerStats;
  onClose: () => void;
}

export function ProfileDashboard({ stats, onClose }: ProfileDashboardProps) {
  return (
    <div className="bg-white/90 p-8 rounded-xl shadow-xl w-[32rem]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Player Profile
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Rating
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.rating}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 mb-1 flex items-center gap-1">
            <Award className="w-4 h-4" />
            Win Rate
          </div>
          <div className="text-2xl font-bold text-green-900">
            {Math.round((stats.wins / (stats.wins + stats.losses + stats.draws)) * 100)}%
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Games
        </h3>
        <div className="space-y-2">
          {stats.recentGames.map((game, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                game.result === 'win'
                  ? 'border-green-200 bg-green-50'
                  : game.result === 'loss'
                  ? 'border-red-200 bg-red-50'
                  : 'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">vs {game.opponent}</span>
                  <span className="text-sm text-gray-500 ml-2">({game.gameMode})</span>
                </div>
                <div className="text-sm">
                  <span
                    className={
                      game.result === 'win'
                        ? 'text-green-600'
                        : game.result === 'loss'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }
                  >
                    {game.result.toUpperCase()}
                  </span>
                  <span className="text-gray-400 ml-2">{game.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-green-600">{stats.wins}</div>
          <div className="text-sm text-gray-600">Wins</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-red-600">{stats.losses}</div>
          <div className="text-sm text-gray-600">Losses</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">{stats.draws}</div>
          <div className="text-sm text-gray-600">Draws</div>
        </div>
      </div>
    </div>
  );
}