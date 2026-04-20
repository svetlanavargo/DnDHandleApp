import { useState } from "react";
import type { Character } from "../types/Character";
import type {
    ClassKey,
    Characteristics,
    SpellSlotsState,
    RaceKey,
    SpellsList,
    SpellLevel
} from "../types/dnd";

import { classesData } from "../constants/classesData";
import { spellSlotProgression } from "../constants/spellSlotProgression";
import { normalizeCharacterNotes } from "../utils/characterNotes";

const THIEVES_TOOLS_KEY = 'thievesTools';

type FormValues = {
    name: string;
    race: RaceKey;
    subrace?: string;
    class: ClassKey;
    subclass?: string;
    speed: string;
    ac: string;
    hits: string;
    level: string;
    initiative: string;
    characteristics: Characteristics;
    skills: string[];
    expertise: string[];
    languages: string[];
    weapons: string[];
    armors: string[];
    tools: string[];
    fill: string;
};

const defaultForm: FormValues = {
    name: "",
    race: "human",
    subrace: undefined,
    class: "fighter",
    subclass: undefined,
    speed: "30",
    ac: "10",
    hits: "1",
    level: "1",
    initiative: "0",
    characteristics: {
        STR: 0,
        DEX: 0,
        CON: 0,
        INT: 0,
        WIS: 0,
        CHA: 0
    },
    skills: [],
    expertise: [],
    languages: [],
    weapons: [],
    armors: [],
    tools: [],
    fill: "fighter"
};

function getInitialFormValues(character: Character | null): FormValues {
    if (!character) {
        return defaultForm;
    }

    return {
        name: character.name,
        race: character.race,
        subrace: character.subrace,
        class: character.class,
        subclass: character.subclass,
        speed: String(character.speed),
        ac: String(character.ac),
        hits: String(character.hits),
        level: String(character.level),
        initiative: String(character.initiative),
        characteristics: { ...character.characteristics },
        skills: [...character.skills],
        expertise: [...character.expertise],
        languages: [...character.languages],
        weapons: [...character.weapons],
        armors: [...character.armors],
        tools: [...character.tools],
        fill: character.fill
    };
}

export function useCharacterForm(character: Character | null) {
    const [formValues, setFormValues] = useState<FormValues>(() => getInitialFormValues(character));

    function getAvailableExpertiseValues(values: FormValues) {
        const available = new Set(values.skills);

        if (values.tools.includes(THIEVES_TOOLS_KEY)) {
            available.add(THIEVES_TOOLS_KEY);
        }

        return available;
    }

    // ================= HELPERS =================
    function getExpertiseLimit(level: number) {
        return level >= 6 ? 4 : 2;
    }

    function getCaster(className: ClassKey, subclassName?: string) {
        const classData = classesData[className];
        if (!classData) return null;

        // 1. сначала проверяем subclass (ВАЖНО!)
        if (
            subclassName &&
            classData.subclasses?.[subclassName]?.caster
        ) {
            return classData.subclasses[subclassName].caster;
        }

        // 2. потом base class
        if (classData.caster) {
            return classData.caster;
        }

        return null;
    }

    function isCasterClass(className: ClassKey, subclassName?: string) {
        return !!getCaster(className, subclassName);
    }

    function getProgressionSlots(
        progression: Record<number, number[]> | undefined,
        level: number
    ): number[] {
        if (!progression) return [];

        const keys = Object.keys(progression)
            .map(Number)
            .filter(l => l <= level);

        if (keys.length === 0) return [];

        return progression[Math.max(...keys)] ?? [];
    }

    // ================= SPELL SLOTS =================
    function initSpellSlots(
        className: ClassKey,
        subclassName: string | undefined,
        level: number
    ): SpellSlotsState {
        const caster = getCaster(className, subclassName);
        if (!caster) return {};

        const progressionKey = caster.progression;

        const progression = spellSlotProgression[progressionKey as keyof typeof spellSlotProgression];

        if (!progression) return {}; // 💣 FIX №1

        const slotsPerLevel = getProgressionSlots(progression, level);

        if (!slotsPerLevel.length) return {}; // 💣 FIX №2

        const state: SpellSlotsState = {};

        slotsPerLevel.forEach((count, index) => {
            const slotLevel = index + 1;
            state[slotLevel] = Array.from({ length: count }, () => false);
        });

        return state;
    }

    // ================= SPELLS =================
    function syncSpells(
        slots: SpellSlotsState,
        existing: SpellsList | undefined,
        caster: boolean
    ): SpellsList {
        const base = existing ?? {};

        const result: SpellsList = {};

        if (caster) {
            result[0] = base[0] ?? [];
        }

        Object.keys(slots).forEach((lvl) => {
            result[lvl as SpellLevel] = base[lvl as SpellLevel] ?? [];
        });

        return result;
    }

    // ================= HANDLERS =================
    function handleChange<K extends keyof FormValues>(
        field: K,
        value: FormValues[K]
    ) {
        setFormValues(prev => {
            const updated = { ...prev, [field]: value };

            const level = Number(updated.level);
            const availableExpertise = getAvailableExpertiseValues(updated);

            return {
                ...updated,
                expertise: updated.expertise
                    .filter(e => availableExpertise.has(e))
                    .slice(0, getExpertiseLimit(level))
            };
        });
    }

    function handleCharacteristicChange(
        key: keyof Characteristics,
        value: number
    ) {
        setFormValues(prev => ({
            ...prev,
            characteristics: {
                ...prev.characteristics,
                [key]: value
            }
        }));
    }

    function handleExpertiseChange(values: string[]) {
        setFormValues(prev => {
            const limit = getExpertiseLimit(Number(prev.level));
            const availableExpertise = getAvailableExpertiseValues(prev);

            return {
                ...prev,
                expertise: values
                    .filter(v => availableExpertise.has(v))
                    .slice(0, limit)
            };
        });
    }

    // ================= BUILD =================
    function buildCharacter(existing: Character | null): Character {
        const level = Number(formValues.level) || 1;
        const hits = Number(formValues.hits) || 1;

        const caster = isCasterClass(formValues.class, formValues.subclass);

        const spellSlots = initSpellSlots(
            formValues.class,
            formValues.subclass,
            level
        );

        const spells = syncSpells(
            spellSlots,
            existing?.spells,
            caster
        );

        return {
            ...existing,
            id: existing?.id ?? crypto.randomUUID(),
            name: formValues.name || "Персонаж",
            race: formValues.race,
            subrace: formValues.subrace,
            class: formValues.class,
            subclass: formValues.subclass,
            speed: Number(formValues.speed),
            ac: Number(formValues.ac),
            hits,
            currentHits: existing?.currentHits ?? hits,
            temporaryHits: existing?.temporaryHits ?? 0,
            level,
            initiative: Number(formValues.initiative),
            characteristics: { ...formValues.characteristics },
            skills: [...formValues.skills],
            expertise: [...formValues.expertise],
            languages: [...formValues.languages],
            weapons: [...formValues.weapons],
            armors: [...formValues.armors],
            tools: [...formValues.tools],
            spellSlots,
            spells,
            diceHitsCount: existing?.diceHitsCount ?? level,
            inventory: existing?.inventory ?? {
                note: "",
                currency: { platinum: 0, gold: 0, silver: 0, bronze: 0 }
            },
            fill: formValues.class,
            note: normalizeCharacterNotes(existing?.note)
        };
    }

    return {
        formValues,
        handleChange,
        handleCharacteristicChange,
        handleExpertiseChange,
        buildCharacter
    };
}
