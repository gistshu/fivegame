
import { Difficulty } from './types';

export const BOARD_SIZE = 50;
export const WIN_COUNT = 5;

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.EASY]: '新手 (Easy)',
  [Difficulty.NORMAL]: '高手 (Normal)',
  [Difficulty.HARD]: '大師 (Hard)',
};

export const COLORS = {
  BOARD: '#D2B48C',
  GRID: '#4B3621',
  BLACK: '#1A1A1A',
  WHITE: '#FDFDFD',
  HIGHLIGHT: 'rgba(255, 255, 0, 0.4)',
};
