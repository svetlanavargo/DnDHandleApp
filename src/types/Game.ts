import React from 'react';
import type { Card } from './CardInBattleTracker.ts';

export type TurnTimeMode = 'turn' | 'round';

export type Game = {
    id: string;
    name: string;
    cards: Card[];
    turnTimeMode: TurnTimeMode;
};

export type GamesState = {
    games: Game[];
    currentGameId: string | null;
};

export interface GameContextType {
    games: Game[];
    currentGame: Game | null;

    setCurrentGame: (id: string) => void;
    createGame: (name: string) => void;
    deleteGame: (id: string) => void;

    addCard: (card: Card) => void;
    updateCard: (id: string, data: Partial<Card>) => void;
    deleteCard: (id: string) => void;

    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    setTurnTimeMode: (gameId: string, mode: TurnTimeMode) => void;
    renameGame: (id: string, name: string) => void;
}
