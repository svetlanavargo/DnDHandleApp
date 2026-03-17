export interface Characteristics {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
}

export interface SpellSlotsState {
    [level: number]: boolean[];
}

export interface Character {
    id: number | string;
    race: string;
    speed: number;
    ac: number;
    name: string;
    hits: number;
    diceHitsCount: number;
    currentHits: number;
    temporaryHits: number;
    initiative: number;
    level: number;
    class: string;
    subclass?: string;
    characteristics: Characteristics;
    skills: string[];
    languages: string[];
    weapons: string[];
    armors: string[];
    tools: string[]
    note?: string;
    spellSlots?: SpellSlotsState;
}