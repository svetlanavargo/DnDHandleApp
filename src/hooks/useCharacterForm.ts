import { useState, useEffect } from "react";
import type { Character } from "../types/Character";
import type {
    ClassKey,
    Characteristics,
    SpellSlotsState, RaceKey
} from "../types/dnd";

import { classesData } from "../constants/classesData";
import rawSpellSlotProgression from "../data/Spells/spellSlotProgression.json";

const spellSlotProgression =
    rawSpellSlotProgression as unknown as Record<string, Record<number, number[]>>;

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
    characteristics: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    skills: [],
    expertise: [],
    languages: [],
    weapons: [],
    armors: [],
    tools: [],
    fill: "fighter"
};

export function useCharacterForm(character: Character | null) {
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);

    // ===== init =====
    useEffect(() => {
        if (character) {
            setFormValues({
                ...defaultForm,
                ...character,
                speed: character.speed.toString(),
                ac: character.ac.toString(),
                hits: character.hits.toString(),
                level: character.level.toString(),
                initiative: character.initiative.toString(),
                characteristics: { ...character.characteristics },
                skills: [...character.skills],
                expertise: character.expertise ? [...character.expertise] : []
            });
        } else {
            setFormValues(defaultForm);
        }
    }, [character]);

    // ===== helpers =====
    function getExpertiseLimit(level: number) {
        return level >= 6 ? 4 : 2;
    }

    function getCantripsKnown(
        table: Record<number, number> | undefined,
        level: number
    ) {
        if (!table) return 0;

        let result = 0;
        for (const lvl in table) {
            if (level >= Number(lvl)) {
                result = table[Number(lvl)];
            }
        }
        return result;
    }

    function initSpellSlots(
        className: ClassKey,
        subclassName: string | undefined,
        level: number
    ): SpellSlotsState {
        const classData = classesData[className];
        if (!classData) return {};

        let caster = classData.caster;

        if (subclassName && classData.subclasses?.[subclassName]?.caster) {
            caster = classData.subclasses[subclassName].caster;
        }

        if (!caster) return {};

        const progression = spellSlotProgression[caster.progression ?? "full"] ?? {};
        const slotsPerLevel = progression[level] ?? [];

        const state: SpellSlotsState = {};

        // slots
        slotsPerLevel.forEach((count, i) => {
            state[i + 1] = Array(count).fill(false);
        });

        // cantrips
        const cantrips = getCantripsKnown(caster.cantripsKnown, level);
        if (cantrips > 0) {
            state[0] = Array(cantrips).fill(true);
        }

        return state;
    }

    // ===== handlers =====
    function handleChange<K extends keyof FormValues>(field: K, value: FormValues[K]) {
        setFormValues(prev => {
            const updated = { ...prev, [field]: value };

            const level = Number(updated.level);
            const limit = getExpertiseLimit(level);

            return {
                ...updated,
                expertise: updated.expertise
                    .filter(e => updated.skills.includes(e))
                    .slice(0, limit)
            };
        });
    }

    function handleCharacteristicChange(key: keyof Characteristics, value: number) {
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

    // ===== submit helper =====
    function buildCharacter(existing: Character | null): Character {
        const level = Number(formValues.level) || 1;
        const hits = Number(formValues.hits) || 1;

        const spellSlots =
            existing &&
            (existing.class !== formValues.class ||
                existing.subclass !== formValues.subclass ||
                existing.level !== level)
                ? initSpellSlots(formValues.class, formValues.subclass, level)
                : existing?.spellSlots ??
                initSpellSlots(formValues.class, formValues.subclass, level);

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
            note: existing?.note ?? []
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