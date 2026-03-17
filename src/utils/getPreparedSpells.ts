import { classes } from '../data/Classes/classes.json';
import { getModifier } from './getModifier.ts';

export function getPreparedSpells(
    className: string,
    level: number,
    characteristics: Record<string, number>
) {
    const caster = classes[className]?.caster

    if (!caster?.preparation) return null

    const ability = caster.ability
    const abilityMod = getModifier(characteristics[ability])

    const formula = caster.preparation.formula

    let value = 0

    if (formula === "ability + level") {
        value = abilityMod + level
    }

    if (formula === "ability + floor(level/2)") {
        value = abilityMod + Math.floor(level / 2)
    }

    return Math.max(value, caster.preparation.min)
}