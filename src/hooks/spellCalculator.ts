import { classes } from '../data/classes';
import type { ClassKey } from '../types/dnd';

import rawSpellSlotProgression from "../data/Spells/spellSlotProgression.json";
const spellSlotProgression = rawSpellSlotProgression as unknown as Record<string, Record<number, number[]>>;


export interface CasterStats {
    slots: number[];
    cantripsKnown: number;
    spellsKnown: number;
    spellAttack: number;
    spellSaveDC: number;
}

export function calculateCaster(
    className: ClassKey,
    level: number,
    abilityMod: number,
    proficiencyBonus: number
): CasterStats | null {
    const cls = classes[className];
    if (!cls?.caster) return null;

    const { caster } = cls;
    const progression = caster.progression ?? 'full';

    // Выбираем таблицу слотов
    const slotsTable =
        progression === 'full'
            ? spellSlotProgression.full
            : progression === 'half'
                ? spellSlotProgression.half
                : spellSlotProgression.full;

    const slots = slotsTable[level] ?? [];

    // Количество известных кантрипов
    const cantripsKnown = Object.entries(caster.cantripsKnown || {})
        .filter(([lvl]) => level >= Number(lvl))
        .map(([, count]) => count)
        .pop() ?? 0;

    // Количество известных заклинаний
    let spellsKnown = 0;

    if (caster.type === 'prepared' && caster.preparation) {
        const { formula, min = 0 } = caster.preparation;
        if (formula === 'ability + level') spellsKnown = abilityMod + level;
        else if (formula === 'ability + floor(level/2)') spellsKnown = abilityMod + Math.floor(level / 2);
        spellsKnown = Math.max(spellsKnown, min);
    } else if (caster.type === 'known') {
        spellsKnown = caster.spellsKnown?.[level] ?? 0;
    } else if (caster.type === 'spellbook') {
        const { starting = 0, perLevel = 0 } = caster.spellbook ?? {};
        spellsKnown = starting + perLevel * (level - 1);
    }

    return {
        slots,
        cantripsKnown,
        spellsKnown,
        spellAttack: abilityMod + proficiencyBonus,
        spellSaveDC: 8 + abilityMod + proficiencyBonus,
    };
}