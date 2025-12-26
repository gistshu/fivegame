
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BoardData, Player } from '../types';
import { BOARD_SIZE, COLORS } from '../constants';

interface BoardProps {
  board: BoardData;
  onMove: (x: number, y: number) => void;
  lastMove: { x: number, y: number } | null;
  isAiThinking: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onMove, lastMove, isAiThinking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const size = Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight) * 0.95;
        setScale(size / 1000); // Base target size 1000px
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1000;
    const padding = 20;
    const gridSize = (size - padding * 2) / (BOARD_SIZE - 1);

    // Clear
    ctx.fillStyle = COLORS.BOARD;
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = COLORS.GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < BOARD_SIZE; i++) {
      // Horizontal
      ctx.moveTo(padding, padding + i * gridSize);
      ctx.lineTo(size - padding, padding + i * gridSize);
      // Vertical
      ctx.moveTo(padding + i * gridSize, padding);
      ctx.lineTo(padding + i * gridSize, size - padding);
    }
    ctx.stroke();

    // Pieces
    const pieceRadius = gridSize * 0.42;
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const piece = board[y][x];
        if (piece) {
          const cx = padding + x * gridSize;
          const cy = padding + y * gridSize;

          // Shadow
          ctx.beginPath();
          ctx.arc(cx + 1, cy + 1, pieceRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fill();

          // Piece
          ctx.beginPath();
          ctx.arc(cx, cy, pieceRadius, 0, Math.PI * 2);
          
          if (piece === 'BLACK') {
            const grad = ctx.createRadialGradient(cx - pieceRadius/3, cy - pieceRadius/3, 1, cx, cy, pieceRadius);
            grad.addColorStop(0, '#555');
            grad.addColorStop(1, COLORS.BLACK);
            ctx.fillStyle = grad;
          } else {
            const grad = ctx.createRadialGradient(cx - pieceRadius/3, cy - pieceRadius/3, 1, cx, cy, pieceRadius);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(1, '#ddd');
            ctx.fillStyle = grad;
          }
          ctx.fill();
          
          if (piece === 'WHITE') {
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Highlight last move
    if (lastMove) {
      const hx = padding + lastMove.x * gridSize;
      const hy = padding + lastMove.y * gridSize;
      ctx.beginPath();
      ctx.arc(hx, hy, pieceRadius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.HIGHLIGHT;
      ctx.fill();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [board, lastMove]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAiThinking) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert screen coordinates back to logical 1000px canvas coordinates
    const scaleFactor = 1000 / rect.width;
    const logicalX = x * scaleFactor;
    const logicalY = y * scaleFactor;

    const padding = 20;
    const gridSize = (1000 - padding * 2) / (BOARD_SIZE - 1);

    const gridX = Math.round((logicalX - padding) / gridSize);
    const gridY = Math.round((logicalY - padding) / gridSize);

    if (gridX >= 0 && gridX < BOARD_SIZE && gridY >= 0 && gridY < BOARD_SIZE) {
      if (!board[gridY][gridX]) {
        onMove(gridX, gridY);
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center w-full h-full overflow-hidden bg-gray-900"
    >
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          width: '1000px', 
          height: '1000px',
          cursor: isAiThinking ? 'wait' : 'crosshair' 
        }}
        className="shadow-2xl transition-transform duration-300 ease-out border-8 border-gray-800 rounded-lg"
      >
        <canvas
          ref={canvasRef}
          width={1000}
          height={1000}
          onClick={handleCanvasClick}
          className="rounded-sm"
        />
        {isAiThinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] pointer-events-none">
            <div className="bg-black/60 text-white px-6 py-3 rounded-full flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              電腦思考中...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
