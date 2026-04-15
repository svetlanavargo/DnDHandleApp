import React, {
    useState,
    useMemo,
    useCallback
} from 'react';

import { GameContext } from './GameContext';

import type { Card } from '../types/CardInBattleTracker';
import type { Game, TurnTimeMode, GameContextType } from '../types/Game';

import { getStore, setStore, createUser, ensureUser } from '../lib/storage';

// === user ===
const USER_ID_KEY = 'currentUserId';

function getUserId() {
    let id = localStorage.getItem(USER_ID_KEY);

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, id);
    }

    return id;
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userId = getUserId();
    createUser(userId);

    // === INIT ===
    const [games, setGames] = useState<Game[]>(() => {
        const store = getStore();
        return store.games[userId] ?? [];
    });

    const [currentGameId, setCurrentGameIdState] = useState<string | null>(() => {
        const store = getStore();

        return (
            store.users[userId]?.currentGameId ??
            store.games[userId]?.[0]?.id ??
            null
        );
    });

    // === sync ===
    const syncStore = (newGames: Game[], newCurrentId: string | null) => {
        const store = getStore();

        ensureUser(store, userId);

        store.games[userId] = newGames;
        store.users[userId].currentGameId = newCurrentId;

        setStore(store);
    };

    // === computed ===
    const currentGame = useMemo(
        () => games.find(g => g.id === currentGameId) || null,
        [games, currentGameId]
    );

    // === API ===

    const setCurrentGame = useCallback((id: string) => {
        setCurrentGameIdState(id);
        syncStore(games, id);
    }, [games]);

    const createGame = useCallback((name: string) => {
        const newGame: Game = {
            id: crypto.randomUUID(),
            name,
            cards: [],
            turnTimeMode: 'round'
        };

        const newGames = [...games, newGame];

        setGames(newGames);
        setCurrentGameIdState(newGame.id);

        syncStore(newGames, newGame.id);
    }, [games]);

    const deleteGame = useCallback((id: string) => {
        const newGames = games.filter(g => g.id !== id);
        const newCurrentId =
            currentGameId === id
                ? newGames[0]?.id ?? null
                : currentGameId;

        setGames(newGames);
        setCurrentGameIdState(newCurrentId);

        syncStore(newGames, newCurrentId);
    }, [games, currentGameId]);

    const renameGame = useCallback((id: string, name: string) => {
        const newGames = games.map(g =>
            g.id === id ? { ...g, name } : g
        );

        setGames(newGames);
        syncStore(newGames, currentGameId);
    }, [games, currentGameId]);

    const setTurnTimeMode = useCallback((gameId: string, mode: TurnTimeMode) => {
        const newGames = games.map(g =>
            g.id === gameId ? { ...g, turnTimeMode: mode } : g
        );

        setGames(newGames);
        syncStore(newGames, currentGameId);
    }, [games, currentGameId]);

    // === cards ===

    const updateCards = useCallback((updater: (cards: Card[]) => Card[]) => {
        const newGames = games.map(game =>
            game.id === currentGameId
                ? { ...game, cards: updater(game.cards) }
                : game
        );

        setGames(newGames);
        syncStore(newGames, currentGameId);
    }, [games, currentGameId]);

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
        games,
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
        games,
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