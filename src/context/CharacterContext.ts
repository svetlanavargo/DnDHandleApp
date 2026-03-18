import { createContext } from 'react';
import type { Character } from '../types/Character';

export interface CharacterContextType {
    characters: Character[];
    activeCharacterId: string | null;
    setActiveCharacterId: (id: string | null) => void;
    addCharacter: (c: Character) => void;
    updateCharacter: (c: Character) => void;
    removeCharacter: (id: string) => void;
}

export const CharacterContext = createContext<CharacterContextType>({
    characters: [],
    activeCharacterId: null,
    setActiveCharacterId: () => {},
    addCharacter: () => {},
    updateCharacter: () => {},
    removeCharacter: () => {}
});