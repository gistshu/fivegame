
import React from 'react';
import { Difficulty } from '../types';
// Correctly import DIFFICULTY_LABELS from constants.ts instead of types.ts
import { DIFFICULTY_LABELS } from '../constants';

interface MenuProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  onStart: () => void;
}

const Menu: React.FC<MenuProps> = ({ selectedDifficulty, onDifficultyChange, onStart }) => {
  const difficulties = [Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-6">
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-6xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          ZEN GOMOKU 50x50
        </h1>
        <p className="text-gray-400 text-lg">大棋盤對弈，挑戰極限智力</p>
      </div>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-center border-b border-gray-700 pb-4">選擇難度</h2>
        
        <div className="space-y-4 mb-8">
          {difficulties.map((diff) => (
            <div
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 flex items-center justify-between ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 border-blue-400 scale-105 shadow-lg shadow-blue-500/20'
                  : 'bg-gray-700 border-transparent hover:bg-gray-600'
              }`}
            >
              <span className="font-bold text-lg">{DIFFICULTY_LABELS[diff]}</span>
              {selectedDifficulty === diff && (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl text-xl hover:bg-blue-50 transition-colors shadow-lg active:scale-95 transform"
          >
            按下 SPACE 開始
          </button>
          <div className="flex justify-center items-center gap-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-gray-700 rounded">↑</kbd><kbd className="px-2 py-1 bg-gray-700 rounded">↓</kbd> 選擇</span>
            <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-gray-700 rounded">SPACE</kbd> 開始</span>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_white]" />
          <span>玩家：白子 (White)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-black border border-gray-600" />
          <span>電腦：黑子 (Black)</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
