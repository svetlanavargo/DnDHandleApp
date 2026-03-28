// ===== БАЗА =====
export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

// ===== КАСТЕР =====
export type CasterType = 'prepared' | 'known' | 'spellbook' | 'pact';
export type ProgressionType = 'full' | 'half' | 'third' | 'pact';

export interface Caster {
    type: CasterType;
    ability: Ability;
    progression: ProgressionType;

    preparation?: {
        formula: string;
        min: number;
    };

    cantripsKnown?: Record<string, number>;
    spellsKnown?: Record<string, number>;

    spellAttack?: { formula: string };
    spellSave?: { formula: string };

    maxSpellLevel?: Record<string, number>;

    spellbook?: {
        starting: number;
        perLevel: number;
    };

    ritual?: boolean;
}

// ===== САБКЛАСС =====
export interface Subclass {
    caster?: Caster;
}

// ===== КЛАСС =====
export interface Class {
    nameEn: string;
    name: string;
    hitDice: string;
    caster: Caster | null;
    subclasses?: Record<string, Subclass>;

    url: string;
    savingThrows: Ability[];
}

// ===== ВСЕ КЛАССЫ =====
export type Classes = Record<string, Class>;

// ===== SPELL SLOTS =====
export type SpellSlotsState = Record<number, boolean[]>;
export type SpellSlotProgression = {
    full: Record<number, number[]>;
    half: Record<number, number[]>;
    third: Record<number, number[]>;
    pact: Record<number, number[]>;
};

// ===== КЛАССЫ (ключи) =====
export type ClassKey =
    | 'barbarian'
    | 'bard'
    | 'cleric'
    | 'druid'
    | 'fighter'
    | 'monk'
    | 'paladin'
    | 'ranger'
    | 'rogue'
    | 'sorcerer'
    | 'warlock'
    | 'wizard'
    | 'artificer';

// ===== РАСЫ =====

// Ключи рас
export const RaceKeys = [
    'aarakocra',
    'aasimar',
    'autognome',
    'astralElf',
    'bugbear',
    'vedalken',
    'verdan',
    'simicHybrid',
    'gith',
    'githzerai',
    'githyanki',
    'giff',
    'gnome',
    'goblin',
    'goliath',
    'grung',
    'dwarf',
    'genasi',
    'dragonborn',
    'deepGnome',
    'duergar',
    'harengon',
    'kalashtar',
    'kender',
    'kenku',
    'centaur',
    'kobold',
    'koboldsOfMidgard',
    'warforged',
    'gearforged',
    'leonin',
    'locathah',
    'loxodon',
    'eladrin',
    'seaElf',
    'shadarKai',
    'glitchling',
    'aven',
    'revenant',
    'lizardfolk',
    'minotaur',
    'orc',
    'accursedTiefling',
    'hobgoblinFeywild',
    'humanOfMidgard',
    'plasmoid',
    'halfOrc',
    'halfling',
    'winterfolkHalflings',
    'halfElf',
    'satyr',
    'owlin',
    'tabaxi',
    'tiefling',
    'tortle',
    'thriKreen',
    'triton',
    'firbolg',
    'fairy',
    'hadozee',
    'hobgoblin',
    'changeling',
    'human',
    'shifter',
    'elf',
    'yuanTi',
    'hexblood',
    'reborn',
    'dhampir',
    'customLineage',
] as const;

export type RaceKey = (typeof RaceKeys)[number];

// ===== РАСА =====
export interface Race {
    nameEn: string;
    name: string;
    url: string;
}

// ===== ХАРАКТЕРИСТИКИ И СКИЛЛЫ =====
export interface Characteristics {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
}

export type Skill = {
    key: string;
    name: string;
    ability: keyof Characteristics;
};

export type SpellSchool =
    | 'abjuration'
    | 'conjuration'
    | 'divination'
    | 'enchantment'
    | 'evocation'
    | 'illusion'
    | 'necromancy'
    | 'transmutation';

export type SpellsList = Partial<Record<SpellLevel, string[]>>;

export type SpellLevel = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export interface Spell {
    url: string;
    nameRu: string;
    nameEn: string;
    lvl: SpellLevel;
    time: string;
    distant: string;
    school: SpellSchool;
    components: string;
    duration: string;

    classes: Partial<Record<string, string>>;
    subclass: Partial<Record<string, string>>;
    races: Partial<Record<string, string>>;

    description: string;
}

// ===== ВАЛЮТА =====
export interface Currency {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
}