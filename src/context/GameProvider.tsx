import React, { createContext, useContext, useEffect, useState } from "react";
import type { Card } from "../types/CardInBattleTracker";

export type TurnTimeMode = 'turn' | 'round';

export type Game = {
    id: string;
    name: string;
    cards: Card[];
    turnTimeMode?: TurnTimeMode;
};

type GamesState = {
    games: Game[];
    currentGameId: string | null;
};

type GameContextType = {
    games: Game[];
    currentGame: Game | null;

    setCurrentGame: (id: string) => void;
    createGame: (name: string) => void;
    deleteGame: (id: string) => void;

    addCard: (card: Card) => void;
    updateCard: (id: string, data: Partial<Card>) => void;
    deleteCard: (id: string) => void;
    renameGame: (id: string, name: string) => void;

    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    setTurnTimeMode: (gameId: string, mode: TurnTimeMode) => void;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GamesState>(() => {
        const saved = localStorage.getItem("games");
        return saved
            ? JSON.parse(saved)
            : { games: [], currentGameId: null };
    });

    useEffect(() => {
        localStorage.setItem("games", JSON.stringify(state));
    }, [state]);

    const currentGame = state.games.find(g => g.id === state.currentGameId) || null;

    const setCurrentGame = (id: string) => {
        setState(prev => ({ ...prev, currentGameId: id }));
    };

    const createGame = (name: string) => {
        const newGame: Game = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            cards: [],
            turnTimeMode: 'round'
        };

        setState(prev => ({
            games: [...prev.games, newGame],
            currentGameId: newGame.id
        }));
    };

    const setTurnTimeMode = (gameId: string, mode: TurnTimeMode) => {
        setState(prev => ({
            ...prev,
            games: prev.games.map(g =>
                g.id === gameId
                    ? { ...g, turnTimeMode: mode }
                    : g
            )
        }));
    };

    const deleteGame = (id: string) => {
        setState(prev => {
            const updatedGames = prev.games.filter(g => g.id !== id);

            const isDeletingCurrent = prev.currentGameId === id;

            return {
                games: updatedGames,
                currentGameId: isDeletingCurrent
                    ? updatedGames[0]?.id ?? null
                    : prev.currentGameId
            };
        });
    };

    const updateCards = (updater: (cards: Card[]) => Card[]) => {
        setState(prev => ({
            ...prev,
            games: prev.games.map(game =>
                game.id === prev.currentGameId
                    ? { ...game, cards: updater(game.cards) }
                    : game
            )
        }));
    };

    const addCard = (card: Card) => {
        updateCards(cards => [...cards, card]);
    };

    const updateCard = (id: string, data: Partial<Card>) => {
        updateCards(cards =>
            cards.map(c => (c.id === id ? { ...c, ...data } : c))
        );
    };

    const deleteCard = (id: string) => {
        updateCards(cards => cards.filter(c => c.id !== id));
    };

    const setCards: React.Dispatch<React.SetStateAction<Card[]>> = (value) => {
        updateCards(prevCards =>
            typeof value === "function" ? value(prevCards) : value
        );
    };

    const renameGame = (id: string, name: string) => {
        setState(prev => ({
            ...prev,
            games: prev.games.map(g =>
                g.id === id ? { ...g, name } : g
            )
        }));
    };

    return (
        <GameContext.Provider
            value={{
                games: state.games,
                currentGame,

                setCurrentGame,
                createGame,
                deleteGame,

                addCard,
                updateCard,
                deleteCard,
                setCards,
                setTurnTimeMode,
                renameGame
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useGame must be used inside GameProvider");
    return ctx;
};