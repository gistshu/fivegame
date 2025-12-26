
export type Player = 'BLACK' | 'WHITE';

export enum Difficulty {
  EASY = 'EASY',
  NORMAL = 'NORMAL',
  HARD = 'HARD'
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface Move {
  x: number;
  y: number;
  score: number;
}

export type BoardData = (Player | null)[][];
