import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from 'react';

import { GameContext } from './GameContext';

import type { Card } from '../types/CardInBattleTracker';
import type { Game, GamesState, TurnTimeMode, GameContextType } from '../types/Game';

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

    const currentGame = useMemo(
        () => state.games.find(g => g.id === state.currentGameId) || null,
        [state.games, state.currentGameId]
    );

    const setCurrentGame = useCallback((id: string) => {
        setState(prev => ({ ...prev, currentGameId: id }));
    }, []);

    const createGame = useCallback((name: string) => {
        const newGame: Game = {
            id: crypto.randomUUID(),
            name,
            cards: [],
            turnTimeMode: 'round'
        };

        setState(prev => ({
            games: [...prev.games, newGame],
            currentGameId: newGame.id
        }));
    }, []);

    const deleteGame = useCallback((id: string) => {
        setState(prev => {
            const updated = prev.games.filter(g => g.id !== id);
            const isCurrent = prev.currentGameId === id;

            return {
                games: updated,
                currentGameId: isCurrent ? updated[0]?.id ?? null : prev.currentGameId
            };
        });
    }, []);

    const renameGame = useCallback((id: string, name: string) => {
        setState(prev => ({
            ...prev,
            games: prev.games.map(g =>
                g.id === id ? { ...g, name } : g
            )
        }));
    }, []);

    const setTurnTimeMode = useCallback((gameId: string, mode: TurnTimeMode) => {
        setState(prev => ({
            ...prev,
            games: prev.games.map(g =>
                g.id === gameId ? { ...g, turnTimeMode: mode } : g
            )
        }));
    }, []);

    const updateCards = useCallback((updater: (cards: Card[]) => Card[]) => {
        setState(prev => ({
            ...prev,
            games: prev.games.map(game =>
                game.id === prev.currentGameId
                    ? { ...game, cards: updater(game.cards) }
                    : game
            )
        }));
    }, []);

    const addCard = useCallback((card: Card) => {
        updateCards(cards => [...cards, card]);
    }, [updateCards]);

    const updateCard = useCallback((id: string, data: Partial<Card>) => {
        updateCards(cards =>
            cards.map(c => c.id === id ? { ...c, ...data } : c)
        );
    }, [updateCards]);

    const deleteCard = useCallback((id: string) => {
        updateCards(cards => cards.filter(c => c.id !== id));
    }, [updateCards]);

    const setCards = useCallback<React.Dispatch<React.SetStateAction<Card[]>>>(
        (value) => {
            updateCards(prev =>
                typeof value === 'function' ? value(prev) : value
            );
        },
        [updateCards]
    );

    const value = useMemo<GameContextType>(() => ({
        games: state.games,
        currentGame,

        setCurrentGame,
        createGame,
        deleteGame,

        renameGame,
        setTurnTimeMode,

        addCard,
        updateCard,
        deleteCard,
        setCards
    }), [
        state.games,
        currentGame,
        setCurrentGame,
        createGame,
        deleteGame,
        renameGame,
        setTurnTimeMode,
        addCard,
        updateCard,
        deleteCard,
        setCards
    ]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};