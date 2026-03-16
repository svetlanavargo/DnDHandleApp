export interface Caster {
    type: "prepared" | "known" | "spellbook" | "half";
    ability: "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
    progression: "full" | "half";
    preparation?: { formula: string; min: number };
    cantripsKnown?: Record<number, number>;
    spellsKnown?: Record<number, number>;
    spellbook?: { starting: number; perLevel: number };
}

export interface ClassData {
    hitDice: string;
    savingThrows: string[];
    caster: Caster | null;
}

export interface ClassesJSON {
    wizard: ClassData;
    cleric: ClassData;
    druid: ClassData;
    paladin: ClassData;
    ranger: ClassData;
    bard: ClassData;
    sorcerer: ClassData;
    warlock: ClassData;
    fighter: ClassData;
    rogue: ClassData;
    monk: ClassData;
    barbarian: ClassData;
}

export interface SpellSlotProgression {
    full: Record<number, number[]>;
    half: Record<number, number[]>;
}