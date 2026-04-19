import type React from 'react';
import type { Card } from './CardInBattleTracker';

export type TurnTimeMode = 'turn' | 'round';

export type Game = {
    id: string;
    name: string;
    cards: Card[];
    turnTimeMode: TurnTimeMode;
};

export type GameContextType = {
    games: Game[];
    currentGame: Game | null;
    currentGameId: string | null;
    setCurrentGame: (id: string) => void;
    createGame: (name: string) => Promise<void>;
    deleteGame: (id: string) => Promise<void>;
    renameGame: (id: string, name: string) => Promise<void>;
    setTurnTimeMode: (gameId: string, mode: TurnTimeMode) => Promise<void>;
    addCard: (card: Card) => void;
    updateCard: (id: string, data: Partial<Card>) => void;
    deleteCard: (id: string) => void;
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
};
