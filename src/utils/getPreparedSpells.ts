import classes from '../data/classes.json';
import type { ClassKey } from '../types/dnd';
import type { Characteristics } from '../types/dnd.ts';
import { getModifier } from './getModifier.ts';

export function getPreparedSpells(
    className: ClassKey,
    level: number,
    characteristics: Characteristics
) {
    const caster = classes[className]?.caster as { // здесь TS понимает caster
        preparation?: { formula: string; min: number };
        ability: keyof Characteristics; // ✅ строго указываем тип
    };

    if (!caster?.preparation) return null;

    const abilityMod = getModifier(characteristics[caster.ability]);

    const formula = caster.preparation.formula;

    let value = 0;

    if (formula === "ability + level") {
        value = abilityMod + level;
    }

    if (formula === "ability + floor(level/2)") {
        value = abilityMod + Math.floor(level / 2);
    }

    return Math.max(value, caster.preparation.min);
}