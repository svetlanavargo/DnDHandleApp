import type { ClassKey, Class } from "../types/dnd.ts";

export const classesData: Record<ClassKey, Class> = {
    artificer: {
        url: "https://dnd.su/class/137-artificer/",
        name: "Изобретатель",
        nameEn: "artificer",
        hitDice: "8",
        savingThrows: ["CON", "INT"],
        caster: {
            type: "prepared",
            ability: "INT",
            progression: "half",
            preparation: { formula: "ability + floor(level/2)", min: 1 },
            cantripsKnown: { 1: 2, 4: 3, 10: 4 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: true
        }
    },
    barbarian: {
        url: "https://dnd.su/class/87-barbarian/",
        name: "Варвар",
        nameEn: "barbarian",
        hitDice: "12",
        savingThrows: ["STR", "CON"],
        caster: null
    },
    bard: {
        url: "https://dnd.su/class/88-bard/",
        name: "Бард",
        nameEn: "bard",
        hitDice: "8",
        savingThrows: ["DEX", "CHA"],
        caster: {
            type: "known",
            ability: "CHA",
            progression: "full",
            cantripsKnown: { 1: 2, 4: 3, 10: 4 },
            spellsKnown: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 14, 11: 15, 12: 15, 13: 16, 14: 16, 15: 17, 16: 17, 17: 18, 18: 18, 19: 19, 20: 22 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: false
        }
    },
    cleric: {
        url: "https://dnd.su/class/89-cleric/",
        name: "Жрец",
        nameEn: "cleric",
        hitDice: "8",
        savingThrows: ["WIS", "CHA"],
        caster: {
            type: "prepared",
            ability: "WIS",
            progression: "full",
            preparation: { formula: "ability + level", min: 1 },
            cantripsKnown: { 1: 3, 4: 4, 10: 5 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: true
        }
    },
    druid: {
        url: "https://dnd.su/class/90-druid/",
        name: "Друид",
        nameEn: "druid",
        hitDice: "8",
        savingThrows: ["INT", "WIS"],
        caster: {
            type: "prepared",
            ability: "WIS",
            progression: "full",
            preparation: { formula: "ability + level", min: 1 },
            cantripsKnown: { 1: 3, 4: 3, 10: 4 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: true
        }
    },
    fighter: {
        url: "https://dnd.su/class/91-fighter/",
        name: "Воин",
        nameEn: "fighter",
        hitDice: "10",
        savingThrows: ["STR", "CON"],
        caster: null,
        subclasses: {
            eldritch_knight: {
                caster: {
                    type: "known",
                    ability: "INT",
                    progression: "third",
                    cantripsKnown: { 3: 3 },
                    spellsKnown: { 3: 3, 4: 3, 5: 4 },
                    spellAttack: { formula: "ability + proficiency" },
                    spellSave: { formula: "8 + ability + proficiency" },
                    maxSpellLevel: { 3: 1, 4: 1, 5: 2 },
                    ritual: false
                }
            }
        }
    },
    monk: {
        url: "https://dnd.su/class/93-monk/",
        name: "Монах",
        nameEn: "monk",
        hitDice: "8",
        savingThrows: ["STR", "DEX"],
        caster: null
    },
    paladin: {
        url: "https://dnd.su/class/94-paladin/",
        name: "Паладин",
        nameEn: "paladin",
        hitDice: "10",
        savingThrows: ["WIS", "CHA"],
        caster: {
            type: "prepared",
            ability: "CHA",
            progression: "half",
            preparation: { formula: "ability + floor(level/2)", min: 1 },
            cantripsKnown: {},
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: false
        }
    },
    ranger: {
        url: "https://dnd.su/class/97-ranger/",
        name: "Следопыт",
        nameEn: "ranger",
        hitDice: "10",
        savingThrows: ["STR", "DEX"],
        caster: {
            type: "prepared",
            ability: "WIS",
            progression: "half",
            preparation: { formula: "ability + floor(level/2)", min: 1 },
            cantripsKnown: {},
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: false
        }
    },
    rogue: {
        url: "https://dnd.su/class/99-rogue/",
        name: "Плут",
        nameEn: "rogue",
        hitDice: "1d8",
        savingThrows: ["DEX", "INT"],
        caster: null,
        subclasses: {
            arcane_trickster: {
                caster: {
                    type: "known",
                    ability: "INT",
                    progression: "third",
                    cantripsKnown: { 3: 3 },
                    spellsKnown: { 3: 3, 4: 3, 5: 4 },
                    spellAttack: { formula: "ability + proficiency" },
                    spellSave: { formula: "8 + ability + proficiency" },
                    maxSpellLevel: { 3: 1, 4: 1, 5: 2 },
                    ritual: false
                }
            }
        }
    },
    sorcerer: {
        url: "https://dnd.su/class/101-sorcerer/",
        name: "Чародей",
        nameEn: "sorcerer",
        hitDice: "6",
        savingThrows: ["CON", "CHA"],
        caster: {
            type: "known",
            ability: "CHA",
            progression: "full",
            cantripsKnown: { 1: 4, 4: 5, 10: 6 },
            spellsKnown: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18, 18: 19, 19: 20, 20: 22 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: false
        }
    },
    warlock: {
        url: "https://dnd.su/class/104-warlock/",
        name: "Колдун",
        nameEn: "warlock",
        hitDice: "8",
        savingThrows: ["WIS", "CHA"],
        caster: {
            type: "known",
            ability: "CHA",
            progression: "full",
            cantripsKnown: { 1: 2, 4: 3, 10: 4 },
            spellsKnown: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18, 18: 19, 19: 20, 20: 22 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: false
        }
    },
    wizard: {
        url: "https://dnd.su/class/105-wizard/",
        name: "Волшебник",
        nameEn: "wizard",
        hitDice: "6",
        savingThrows: ["INT", "WIS"],
        caster: {
            type: "spellbook",
            ability: "INT",
            progression: "full",
            preparation: { formula: "ability + level", min: 1 },
            spellbook: { starting: 6, perLevel: 2 },
            cantripsKnown: { 1: 3, 4: 4, 10: 5 },
            spellAttack: { formula: "ability + proficiency" },
            spellSave: { formula: "8 + ability + proficiency" },
            maxSpellLevel: {
                1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3,
                7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6,
                13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9,
                19: 9, 20: 9
            },
            ritual: true
        }
    }
} as const;