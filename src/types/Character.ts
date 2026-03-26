import type { ClassKey, RaceKey, Characteristics, SpellSlotsState, Currency } from './dnd.ts';

export interface Character {
    id: string;
    race: RaceKey;
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
    note: string[];
    spellSlots?: SpellSlotsState;
    inventory: {
        note: string;
        currency: Currency;
    };
    fill: string
}