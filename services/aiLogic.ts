
import { BoardData, Player, Difficulty, Move } from '../types';
import { BOARD_SIZE, WIN_COUNT } from '../constants';

// Basic heuristic scores
const SCORE = {
  WIN: 1000000,
  FOUR_OPEN: 100000,
  FOUR_BLOCKED: 10000,
  THREE_OPEN: 10000,
  THREE_BLOCKED: 1000,
  TWO_OPEN: 1000,
  TWO_BLOCKED: 100,
  ONE: 10,
};

/**
 * Evaluates the board for a specific player at a specific position
 */
function evaluatePosition(board: BoardData, x: number, y: number, player: Player): number {
  let totalScore = 0;
  const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';

  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];

  for (const [dx, dy] of directions) {
    let count = 1;
    let blockCount = 0;

    // Check one way
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
        blockCount++;
        break;
      }
      if (board[ny][nx] === player) {
        count++;
      } else if (board[ny][nx] === opponent) {
        blockCount++;
        break;
      } else {
        break;
      }
    }

    // Check the other way
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;
      if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
        blockCount++;
        break;
      }
      if (board[ny][nx] === player) {
        count++;
      } else if (board[ny][nx] === opponent) {
        blockCount++;
        break;
      } else {
        break;
      }
    }

    if (count >= WIN_COUNT) totalScore += SCORE.WIN;
    else if (count === 4) totalScore += blockCount === 0 ? SCORE.FOUR_OPEN : (blockCount === 1 ? SCORE.FOUR_BLOCKED : 0);
    else if (count === 3) totalScore += blockCount === 0 ? SCORE.THREE_OPEN : (blockCount === 1 ? SCORE.THREE_BLOCKED : 0);
    else if (count === 2) totalScore += blockCount === 0 ? SCORE.TWO_OPEN : (blockCount === 1 ? SCORE.TWO_BLOCKED : 0);
    else if (count === 1) totalScore += SCORE.ONE;
  }

  return totalScore;
}

/**
 * Returns the best move for the AI (Computer is BLACK)
 */
export function getBestMove(board: BoardData, difficulty: Difficulty): { x: number, y: number } {
  const possibleMoves: Move[] = [];
  
  // Optimization: Only check empty squares near existing pieces
  const checkRange = 2;
  const hasNeighbor = (x: number, y: number) => {
    for (let i = -checkRange; i <= checkRange; i++) {
      for (let j = -checkRange; j <= checkRange; j++) {
        const nx = x + i;
        const ny = y + j;
        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] !== null) {
          return true;
        }
      }
    }
    return false;
  };

  // If board is empty, start in center
  let empty = true;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] !== null) {
        empty = false;
        break;
      }
    }
    if (!empty) break;
  }

  if (empty) {
    return { x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) };
  }

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x] === null && hasNeighbor(x, y)) {
        // AI score (Attack)
        const myScore = evaluatePosition(board, x, y, 'BLACK');
        // Player score (Defense)
        const enemyScore = evaluatePosition(board, x, y, 'WHITE');
        
        // Weight balance based on difficulty
        let finalScore = 0;
        if (difficulty === Difficulty.EASY) {
           // Easy: mostly random, low weight on evaluation
           finalScore = (myScore * 0.5 + enemyScore * 0.5) + Math.random() * 50;
        } else if (difficulty === Difficulty.NORMAL) {
           finalScore = myScore * 0.8 + enemyScore * 1.0; // Balanced defense/attack
        } else {
           finalScore = myScore * 1.1 + enemyScore * 1.0; // Aggressive
        }

        possibleMoves.push({ x, y, score: finalScore });
      }
    }
  }

  // Sort and pick best
  possibleMoves.sort((a, b) => b.score - a.score);
  
  // Randomness for Easy/Normal
  if (difficulty === Difficulty.EASY) {
    const pool = possibleMoves.slice(0, 5);
    return pool[Math.floor(Math.random() * pool.length)];
  }
  
  return possibleMoves[0];
}

/**
 * Checks if a move results in a win
 */
export function checkWin(board: BoardData, x: number, y: number, player: Player): boolean {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (const [dx, dy] of directions) {
    let count = 1;
    // Positive direction
    for (let i = 1; i < 5; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === player) count++;
      else break;
    }
    // Negative direction
    for (let i = 1; i < 5; i++) {
      const nx = x - dx * i;
      const ny = y - dy * i;
      if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && board[ny][nx] === player) count++;
      else break;
    }
    if (count >= WIN_COUNT) return true;
  }
  return false;
}
