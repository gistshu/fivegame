
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Difficulty, Player, BoardData } from './types';
import { BOARD_SIZE } from './constants';
import Menu from './components/Menu';
import Board from './components/Board';
import GameOver from './components/GameOver';
import { getBestMove, checkWin } from './services/aiLogic';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [board, setBoard] = useState<BoardData>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('BLACK'); // Black goes first usually, but we want Computer to be Black
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [lastMove, setLastMove] = useState<{ x: number, y: number } | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Initialize empty board
  const initBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    setBoard(newBoard);
    setLastMove(null);
    setWinner(null);
  };

  const startGame = useCallback(() => {
    initBoard();
    setGameState(GameState.PLAYING);
    // In many Gomoku variants, Black starts. 
    // If Computer is Black, let's trigger its first move if it's Black's turn.
    setCurrentPlayer('BLACK');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(GameState.MENU);
  }, []);

  // Computer's move logic
  useEffect(() => {
    if (gameState === GameState.PLAYING && currentPlayer === 'BLACK' && !winner) {
      setIsAiThinking(true);
      // Small timeout for visual feel
      const timer = setTimeout(() => {
        const move = getBestMove(board, difficulty);
        if (move) {
          executeMove(move.x, move.y, 'BLACK');
        }
        setIsAiThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer, winner, board, difficulty]);

  const executeMove = (x: number, y: number, player: Player) => {
    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = player;
    setBoard(newBoard);
    setLastMove({ x, y });

    if (checkWin(newBoard, x, y, player)) {
      setWinner(player);
      setGameState(GameState.FINISHED);
      return;
    }

    // Check for draw
    const isDraw = newBoard.every(row => row.every(cell => cell !== null));
    if (isDraw) {
      setWinner('DRAW');
      setGameState(GameState.FINISHED);
      return;
    }

    setCurrentPlayer(player === 'WHITE' ? 'BLACK' : 'WHITE');
  };

  const handlePlayerMove = (x: number, y: number) => {
    if (gameState !== GameState.PLAYING || currentPlayer !== 'WHITE' || winner || board[y][x]) {
      return;
    }
    executeMove(x, y, 'WHITE');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.MENU) {
        if (e.key === 'ArrowUp') {
          setDifficulty(prev => {
            if (prev === Difficulty.HARD) return Difficulty.NORMAL;
            if (prev === Difficulty.NORMAL) return Difficulty.EASY;
            return Difficulty.HARD;
          });
        } else if (e.key === 'ArrowDown') {
          setDifficulty(prev => {
            if (prev === Difficulty.EASY) return Difficulty.NORMAL;
            if (prev === Difficulty.NORMAL) return Difficulty.HARD;
            return Difficulty.EASY;
          });
        } else if (e.key === ' ') {
          e.preventDefault();
          startGame();
        }
      } else if (gameState === GameState.FINISHED) {
        if (e.key === 'Enter') {
          handleRestart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, handleRestart]);

  const countPieces = () => {
    let black = 0;
    let white = 0;
    board.forEach(row => row.forEach(cell => {
      if (cell === 'BLACK') black++;
      if (cell === 'WHITE') white++;
    }));
    return { black, white };
  };

  const { black: blackCount, white: whiteCount } = countPieces();

  return (
    <div className="h-screen w-screen bg-gray-900 select-none overflow-hidden flex flex-col">
      {gameState === GameState.MENU && (
        <Menu 
          selectedDifficulty={difficulty} 
          onDifficultyChange={setDifficulty} 
          onStart={startGame} 
        />
      )}

      {gameState !== GameState.MENU && (
        <div className="flex-1 flex flex-col h-full relative">
          {/* Header info */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gray-900/60 backdrop-blur-md border-b border-gray-800">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentPlayer === 'WHITE' ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm font-bold text-gray-300">玩家: {whiteCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentPlayer === 'BLACK' ? 'bg-red-400 animate-pulse' : 'bg-black border border-gray-600'}`} />
                  <span className="text-sm font-bold text-gray-300">電腦: {blackCount}</span>
                </div>
             </div>
             <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Difficulty: {difficulty} | Board: 50x50
             </div>
             <button 
                onClick={handleRestart}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-md border border-gray-700 transition-colors"
             >
                退出局
             </button>
          </div>

          <Board 
            board={board} 
            onMove={handlePlayerMove} 
            lastMove={lastMove}
            isAiThinking={isAiThinking}
          />
        </div>
      )}

      {gameState === GameState.FINISHED && winner && (
        <GameOver 
          winner={winner} 
          blackCount={blackCount} 
          whiteCount={whiteCount} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default App;
