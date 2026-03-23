import React, { useState, useEffect } from 'react';
import { CharacterContext } from './CharacterContext';
import type { Character } from '../types/Character';

interface Props {
    children: React.ReactNode;
}

export default function CharacterProvider({ children }: Props) {
    const [characters, setCharacters] = useState<Character[]>(() => {
        const saved = localStorage.getItem('characters');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(() => {
        const savedId = localStorage.getItem('activeCharacterId');
        return savedId ?? (characters[0]?.id ?? null);
    });

    // === Синхронизация с localStorage ===
    useEffect(() => {
        localStorage.setItem('characters', JSON.stringify(characters));
    }, [characters]);

    useEffect(() => {
        localStorage.setItem('activeCharacterId', activeCharacterId ?? '');
    }, [activeCharacterId]);

    const addCharacter = (c: Character) => {
        setCharacters(prev => [...prev, c]);
        setActiveCharacterId(c.id);
    };

    const updateCharacter = (c: Character) => {
        setCharacters(prev =>
            prev.map(ch => (ch.id === c.id ? { ...ch, ...c } : ch))
        );
    };

    const removeCharacter = (id: string) => {
        setCharacters(prevChars => {
            const remaining = prevChars.filter(c => c.id !== id);
            setActiveCharacterId(remaining[0]?.id ?? null);
            return remaining;
        });
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