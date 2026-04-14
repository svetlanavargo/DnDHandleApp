import { createContext } from 'react';
import type { GameContextType } from '../types/Game';

export const GameContext = createContext<GameContextType | null>(null);