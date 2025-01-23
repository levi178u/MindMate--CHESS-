import React, { useState, useEffect } from 'react';
import { Lightbulb, BookOpen, Target, ChevronRight as ChessKnight } from 'lucide-react';
import { ChessTip } from '../types/chess';

interface TipsSectionProps {
  onClose: () => void;
}

export function TipsSection({ onClose }: TipsSectionProps) {
  const [tips, setTips] = useState<ChessTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ChessTip['category']>('opening');

  useEffect(() => {
    // In a real app, fetch from your Flask API
    fetchTips();
  }, [selectedCategory]);

  const fetchTips = async () => {
    try {
      // This would be your Flask API endpoint
      const response = await fetch(`http://localhost:5000/api/tips?category=${selectedCategory}`);
      const data = await response.json();
      setTips(data);
    } catch (error) {
      console.error('Failed to fetch tips:', error);
    }
  };

  const categories = [
    { id: 'opening', icon: BookOpen, label: 'Openings' },
    { id: 'middlegame', icon: Target, label: 'Middlegame' },
    { id: 'endgame', icon: ChessKnight, label: 'Endgame' },
    { id: 'tactics', icon: Target, label: 'Tactics' },
    { id: 'strategy', icon: Lightbulb, label: 'Strategy' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-xl w-[48rem] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Chess Tips & Improvement
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              {categories.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    selectedCategory === id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedCategory(id as ChessTip['category'])}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{tip.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      tip.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-800'
                        : tip.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tip.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}