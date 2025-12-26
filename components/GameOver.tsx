
import React from 'react';
import { Player } from '../types';

interface GameOverProps {
  winner: Player | 'DRAW';
  blackCount: number;
  whiteCount: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ winner, blackCount, whiteCount, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl max-w-md w-full animate-scale-up">
        <h2 className="text-4xl font-black text-center mb-2">
          {winner === 'WHITE' ? (
            <span className="text-blue-400">你贏了！</span>
          ) : winner === 'BLACK' ? (
            <span className="text-red-400">電腦獲勝</span>
          ) : (
            <span className="text-gray-400">平局</span>
          )}
        </h2>
        <p className="text-gray-400 text-center mb-8">精彩的對局</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-700/50 p-4 rounded-2xl text-center">
            <div className="flex justify-center mb-2">
              <div className="w-6 h-6 rounded-full bg-white shadow-lg" />
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">玩家白子</div>
            <div className="text-3xl font-black text-white">{whiteCount}</div>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-2xl text-center">
            <div className="flex justify-center mb-2">
              <div className="w-6 h-6 rounded-full bg-black border border-gray-600 shadow-lg" />
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">電腦黑子</div>
            <div className="text-3xl font-black text-white">{blackCount}</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-white text-gray-900 font-bold rounded-xl text-xl hover:bg-gray-200 transition-all transform active:scale-95 shadow-xl"
        >
          按下 ENTER 重回主畫面
        </button>
      </div>
    </div>
  );
};

export default GameOver;
