import { useState, useEffect } from "react";
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

// ===== EMPTY SPELLS =====
const createEmptySpells = (): SpellsList => ({});

// ===== FORM TYPE =====
type FormValues = {
    name: string;
    race: RaceKey;
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
    spells?: SpellsList;
};

const defaultForm: FormValues = {
    name: "",
    race: "human",
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
    fill: "fighter",
};

// ===== HOOK =====
export function useCharacterForm(character: Character | null) {
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);

    // ================= INIT =================
    useEffect(() => {
        if (!character) {
            setFormValues(defaultForm);
            return;
        }

        setFormValues({
            ...defaultForm,
            ...character,
            speed: String(character.speed),
            ac: String(character.ac),
            hits: String(character.hits),
            level: String(character.level),
            initiative: String(character.initiative),
            characteristics: { ...character.characteristics },
            skills: [...character.skills],
            expertise: character.expertise ? [...character.expertise] : [],
            spells: character.spells ?? createEmptySpells()
        });
    }, [character]);

    // ================= UTILS =================
    function getExpertiseLimit(level: number) {
        return level >= 6 ? 4 : 2;
    }

    function getProgressionSlots(
        progression: Record<number, number[]>,
        level: number
    ): number[] {
        const levels = Object.keys(progression)
            .map(Number)
            .filter(l => l <= level);

        if (levels.length === 0) return [];

        const bestLevel = Math.max(...levels);

        return progression[bestLevel];
    }

    // ================= CASTER CHECK =================
    function getCaster(className: ClassKey, subclassName?: string) {
        const classData = classesData[className];
        if (!classData?.caster) return null;

        if (
            subclassName &&
            classData.subclasses?.[subclassName]?.caster
        ) {
            return classData.subclasses[subclassName].caster;
        }

        return classData.caster;
    }

    function isCasterClass(className: ClassKey, subclassName?: string) {
        return !!getCaster(className, subclassName);
    }

    // ================= SPELL SLOTS =================
    function initSpellSlots(
        className: ClassKey,
        subclassName: string | undefined,
        level: number
    ): SpellSlotsState {
        const caster = getCaster(className, subclassName);
        if (!caster) return {};

        const progression =
            spellSlotProgression[caster.progression ?? "full"] ?? {};

        const slotsPerLevel = getProgressionSlots(progression, level);

        const state: SpellSlotsState = {};

        // ❌ NO 0 HERE EVER
        slotsPerLevel.forEach((count, index) => {
            const slotLevel = index + 1;
            state[slotLevel] = Array.from({ length: count }, () => false);
        });

        return state;
    }

    // ================= SPELL NORMALIZATION =================
    function normalizeSpells(spells?: SpellsList): SpellsList {
        return spells ? { ...spells } : {};
    }

    function syncSpellsWithSlots(
        slots: SpellSlotsState,
        prev: SpellsList | undefined,
        caster: boolean
    ): SpellsList {
        const base = normalizeSpells(prev);
        const result: SpellsList = {};

        // ✅ CANTRIPS ONLY FOR CASTERS
        if (caster) {
            result[0] = base[0] ?? [];
        }

        (Object.keys(slots) as SpellLevel[]).forEach((lvl) => {
            result[lvl] = base[lvl] ?? [];
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

            return {
                ...updated,
                expertise: updated.expertise
                    .filter(e => updated.skills.includes(e))
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

            return {
                ...prev,
                expertise: values
                    .filter(v => prev.skills.includes(v))
                    .slice(0, limit)
            };
        });
    }

    // ================= BUILD =================
    function buildCharacter(existing: Character | null): Character {
        const level = Number(formValues.level) || 1;
        const hits = Number(formValues.hits) || 1;

        const caster = isCasterClass(
            formValues.class,
            formValues.subclass
        );

        const spellSlots = initSpellSlots(
            formValues.class,
            formValues.subclass,
            level
        );

        const spells = syncSpellsWithSlots(
            spellSlots,
            formValues.spells,
            caster
        );

        return {
            ...existing,
            id: existing?.id ?? crypto.randomUUID(),
            name: formValues.name || "Персонаж",
            race: formValues.race,
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
            diceHitsCount: existing?.diceHitsCount ?? level,
            inventory: existing?.inventory ?? {
                note: "",
                currency: { platinum: 0, gold: 0, silver: 0, bronze: 0 }
            },
            fill: formValues.class,
            note: existing?.note ?? [],
            spells
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