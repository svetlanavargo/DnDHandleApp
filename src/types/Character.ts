import type { ClassKey, RaceKey, Characteristics, SpellSlotsState, Currency, SpellsList } from './dnd.ts';

export interface CharacterNote {
    id: string;
    text: string;
}

export type LegacyCharacterNote = string;
export type NotesInput = Array<CharacterNote | LegacyCharacterNote>;

export interface Character {
    id: string;
    race: RaceKey;
    subrace?: string;
    speed: number;
    ac: number;
    name: string;
    hits: number;
    diceHitsCount: number;
    currentHits: number;
    temporaryHits: number;
    initiative: number;
    level: number;
    class: ClassKey;
    subclass?: string;
    characteristics: Characteristics;
    skills: string[];
    expertise: string[];
    languages: string[];
    weapons: string[];
    armors: string[];
    tools: string[]
    note: CharacterNote[];
    spellSlots?: SpellSlotsState;
    spells?: SpellsList;
    inventory: {
        note: string;
        currency: Currency;
    };
    fill: string
}
