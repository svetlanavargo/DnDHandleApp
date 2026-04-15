import React, { useState } from 'react';
import { CharacterContext } from './CharacterContext';
import type { Character } from '../types/Character';
import { getStore, setStore, createUser, ensureUser } from '../lib/storage';

interface Props {
    children: React.ReactNode;
}

// 👉 временно: один пользователь (потом заменим на accessKey)
const USER_ID_KEY = 'currentUserId';

function getUserId() {
    let id = localStorage.getItem(USER_ID_KEY);

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, id);
    }

    return id;
}

export default function CharacterProvider({ children }: Props) {
    const userId = getUserId();
    createUser(userId);

    const [characters, setCharacters] = useState<Character[]>(() => {
        const store = getStore();
        return store.characters[userId] ?? [];
    });

    const [activeCharacterId, setActiveCharacterIdState] = useState<string | null>(() => {
        const store = getStore();
        const chars = store.characters[userId] ?? [];

        return (
            store.users[userId]?.activeCharacterId ??
            chars[0]?.id ??
            null
        );
    });

    // === helpers ===

    const syncStore = (newChars: Character[], newActiveId: string | null) => {
        const store = getStore();

        ensureUser(store, userId);

        store.characters[userId] = newChars;
        store.users[userId].activeCharacterId = newActiveId;

        setStore(store);
    };

    // === API ===

    const addCharacter = (c: Character) => {
        const newChars = [...characters, c];

        setCharacters(newChars);
        setActiveCharacterIdState(c.id);

        syncStore(newChars, c.id);
    };

    const updateCharacter = (c: Character) => {
        const newChars = characters.map(ch =>
            ch.id === c.id ? { ...ch, ...c } : ch
        );

        setCharacters(newChars);
        syncStore(newChars, activeCharacterId);
    };

    const removeCharacter = (id: string) => {
        const newChars = characters.filter(c => c.id !== id);
        const newActiveId = newChars[0]?.id ?? null;

        setCharacters(newChars);
        setActiveCharacterIdState(newActiveId);

        syncStore(newChars, newActiveId);
    };

    const setActiveCharacterId = (id: string | null) => {
        setActiveCharacterIdState(id);
        syncStore(characters, id);
    };

    return (
        <CharacterContext.Provider
            value={{
                characters,
                activeCharacterId,
                setActiveCharacterId,
                addCharacter,
                updateCharacter,
                removeCharacter
            }}
        >
            {children}
        </CharacterContext.Provider>
    );
}