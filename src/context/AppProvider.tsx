import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CharacterContext } from './CharacterContext';
import { GameContext } from './GameContext';
import { useAuth } from './auth/useAuth';

import {
    createCharacter as createCharacterRequest,
    deleteCharacter as deleteCharacterRequest,
    getCharacters,
    updateCharacter as updateCharacterRequest,
} from '../api/characters';
import {
    type ApiGame,
    createGame as createGameRequest,
    deleteGame as deleteGameRequest,
    getGames,
    updateGame as updateGameRequest,
} from '../api/games';
import { getApiErrorMessage } from '../api/apiTypes';

import type { Character } from '../types/Character';
import type { Game, TurnTimeMode } from '../types/Game';
import type { Card } from '../types/CardInBattleTracker';
import { normalizeCharacterNotes } from '../utils/characterNotes';

type AppProviderProps = {
    children: React.ReactNode;
};

type AppProviderInnerProps = AppProviderProps & {
    isAuthLoading: boolean;
    isGuest: boolean;
};

function toFrontendTurnMode(mode: 'round' | 'time' | 'turn'): TurnTimeMode {
    return mode === 'time' ? 'turn' : mode;
}

function toApiTurnMode(mode: TurnTimeMode): 'round' | 'time' {
    return mode === 'turn' ? 'time' : 'round';
}

function normalizeGame(game: ApiGame | Game): Game {
    return {
        ...game,
        turnTimeMode: toFrontendTurnMode(game.turnTimeMode),
    };
}

function syncableGame(game: Game): ApiGame {
    return {
        ...game,
        turnTimeMode: toApiTurnMode(game.turnTimeMode),
    };
}

function normalizeCharacter(character: Character): Character {
    return {
        ...character,
        note: normalizeCharacterNotes(character.note),
    };
}

function getNextActiveId<T extends { id: string }>(
    items: T[],
    currentId: string | null
) {
    if (currentId && items.some(item => item.id === currentId)) {
        return currentId;
    }

    return items[0]?.id ?? null;
}

function AppProviderInner({ children, isAuthLoading, isGuest }: AppProviderInnerProps) {
    const [games, setGames] = useState<Game[]>([]);
    const [isGamesLoading, setIsGamesLoading] = useState(!isGuest);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isCharactersLoading, setIsCharactersLoading] = useState(!isGuest);
    const [currentGameId, setCurrentGameId] = useState<string | null>(null);
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (isAuthLoading) {
            return;
        }

        if (isGuest) {
            setIsGamesLoading(false);
            setIsCharactersLoading(false);
            return;
        }

        setIsGamesLoading(true);
        setIsCharactersLoading(true);

        (async () => {
            try {
                const [gamesResponse, charactersResponse] = await Promise.all([
                    getGames(),
                    getCharacters(),
                ]);

                if (cancelled) {
                    return;
                }

                const nextGames = gamesResponse.ok
                    ? gamesResponse.data.map(normalizeGame)
                    : [];
                const nextCharacters = charactersResponse.ok
                    ? charactersResponse.data.map(normalizeCharacter)
                    : [];

                setGames(nextGames);
                setCharacters(nextCharacters);
                setCurrentGameId(prev => getNextActiveId(nextGames, prev));
                setActiveCharacterId(prev => getNextActiveId(nextCharacters, prev));
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(error);
                setGames([]);
                setCharacters([]);
                setCurrentGameId(null);
                setActiveCharacterId(null);
            } finally {
                if (!cancelled) {
                    setIsGamesLoading(false);
                    setIsCharactersLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isAuthLoading, isGuest]);

    const currentGame = useMemo(
        () => games.find(game => game.id === currentGameId) ?? null,
        [games, currentGameId]
    );

    const persistGame = useCallback(
        async (game: Game, method: 'create' | 'update') => {
            if (isAuthLoading) {
                throw new Error('Подождите, восстанавливаем сессию.');
            }

            if (isGuest) {
                return game;
            }

            const response = method === 'create'
                ? await createGameRequest(syncableGame(game))
                : await updateGameRequest(syncableGame(game));

            if (!response.ok) {
                throw new Error(getApiErrorMessage(response.error));
            }

            return normalizeGame(response.data);
        },
        [isAuthLoading, isGuest]
    );

    const persistCharacter = useCallback(
        async (character: Character, method: 'create' | 'update') => {
            if (isAuthLoading) {
                throw new Error('Подождите, восстанавливаем сессию.');
            }

            if (isGuest) {
                return character;
            }

            const response = method === 'create'
                ? await createCharacterRequest(character)
                : await updateCharacterRequest(character);

            if (!response.ok) {
                throw new Error(getApiErrorMessage(response.error));
            }

            return normalizeCharacter(response.data);
        },
        [isAuthLoading, isGuest]
    );

    const createGame = useCallback(async (name: string) => {
        const draft: Game = {
            id: crypto.randomUUID(),
            name,
            cards: [],
            turnTimeMode: 'round',
        };

        const saved = await persistGame(draft, 'create');

        setGames(prev => [...prev, saved]);
        setCurrentGameId(saved.id);
    }, [persistGame]);

    const deleteGame = useCallback(async (id: string) => {
        if (isAuthLoading) {
            return;
        }

        if (!isGuest) {
            const response = await deleteGameRequest(id);

            if (!response.ok) {
                throw new Error(getApiErrorMessage(response.error));
            }
        }

        setGames(prev => {
            const nextGames = prev.filter(game => game.id !== id);

            setCurrentGameId(currentId => {
                if (currentId !== id) {
                    return getNextActiveId(nextGames, currentId);
                }

                return nextGames[0]?.id ?? null;
            });

            return nextGames;
        });
    }, [isAuthLoading, isGuest]);

    const updateGameState = useCallback(async (
        gameId: string,
        updater: (game: Game) => Game
    ) => {
        const current = games.find(game => game.id === gameId);

        if (!current) {
            return;
        }

        const nextGame = updater(current);
        const saved = await persistGame(nextGame, 'update');

        setGames(prev => prev.map(game => (
            game.id === gameId ? saved : game
        )));
    }, [games, persistGame]);

    const renameGame = useCallback(async (id: string, name: string) => {
        await updateGameState(id, game => ({ ...game, name }));
    }, [updateGameState]);

    const setTurnTimeMode = useCallback(async (gameId: string, mode: TurnTimeMode) => {
        await updateGameState(gameId, game => ({ ...game, turnTimeMode: mode }));
    }, [updateGameState]);

    const setCurrentGame = useCallback((id: string) => {
        setCurrentGameId(id);
    }, []);

    const setCards = useCallback((value: React.SetStateAction<Card[]>) => {
        if (!currentGame) {
            return;
        }

        void updateGameState(currentGame.id, game => ({
            ...game,
            cards: typeof value === 'function' ? value(game.cards) : value
        }));
    }, [currentGame, updateGameState]);

    const addCharacter = useCallback(async (character: Character) => {
        const saved = await persistCharacter(character, 'create');

        setCharacters(prev => [...prev, saved]);
        setActiveCharacterId(saved.id);
    }, [persistCharacter]);

    const updateCharacter = useCallback(async (character: Character) => {
        const saved = await persistCharacter(character, 'update');

        setCharacters(prev => prev.map(item => (
            item.id === character.id ? saved : item
        )));
    }, [persistCharacter]);

    const removeCharacter = useCallback(async (id: string) => {
        if (isAuthLoading) {
            return;
        }

        if (!isGuest) {
            const response = await deleteCharacterRequest(id);

            if (!response.ok) {
                throw new Error(getApiErrorMessage(response.error));
            }
        }

        setCharacters(prev => {
            const nextCharacters = prev.filter(character => character.id !== id);

            setActiveCharacterId(currentId => {
                if (currentId !== id) {
                    return getNextActiveId(nextCharacters, currentId);
                }

                return nextCharacters[0]?.id ?? null;
            });

            return nextCharacters;
        });
    }, [isAuthLoading, isGuest]);

    const gameValue = useMemo(() => ({
        games,
        isGamesLoading,
        currentGame,
        currentGameId,
        setCurrentGame,
        createGame,
        deleteGame,
        renameGame,
        setTurnTimeMode,
        addCard: (card: Card) => setCards(prev => [...prev, card]),
        updateCard: (id: string, data: Partial<Card>) => setCards(prev =>
            prev.map(card => (card.id === id ? { ...card, ...data } : card))
        ),
        deleteCard: (id: string) => setCards(prev =>
            prev.filter(card => card.id !== id)
        ),
        setCards,
    }), [
        games,
        isGamesLoading,
        currentGame,
        currentGameId,
        setCurrentGame,
        createGame,
        deleteGame,
        renameGame,
        setTurnTimeMode,
        setCards,
    ]);

    const characterValue = useMemo(() => ({
        characters,
        isCharactersLoading,
        activeCharacterId,
        setActiveCharacterId,
        addCharacter,
        updateCharacter,
        removeCharacter,
    }), [
        characters,
        isCharactersLoading,
        activeCharacterId,
        addCharacter,
        updateCharacter,
        removeCharacter,
    ]);

    return (
        <GameContext.Provider value={gameValue}>
            <CharacterContext.Provider value={characterValue}>
                {children}
            </CharacterContext.Provider>
        </GameContext.Provider>
    );
}

export function AppProvider({ children }: AppProviderProps) {
    const { user, loading } = useAuth();

    return (
        <AppProviderInner
            key={user?.id ?? 'guest'}
            isAuthLoading={loading}
            isGuest={!user}
        >
            {children}
        </AppProviderInner>
    );
}
