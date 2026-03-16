import { classes, spellSlotProgression } from './classes';

export function calculateCaster(
    className: keyof typeof classes,
    level: number,
    abilityMod: number,
    proficiencyBonus: number
) {
    const cls = classes[className];
    if (!cls?.caster) return null;

    const { caster } = cls;
    const progression = caster.progression;

    const slotsTable =
        progression === 'full'
            ? spellSlotProgression.full
            : progression === 'half'
                ? spellSlotProgression.half
                : spellSlotProgression.full;

    const slots = slotsTable[level] || [];

    const cantripsKnown =
        caster.cantripsKnown &&
        Object.keys(caster.cantripsKnown)
            .filter((lvl) => level >= Number(lvl))
            .map((lvl) => caster.cantripsKnown![Number(lvl)])
            .pop() || 0;

    let spellsKnown = 0;
    if (caster.type === 'prepared' && caster.preparation) {
        const formula = caster.preparation.formula;
        if (formula === 'ability + level') spellsKnown = abilityMod + level;
        else if (formula === 'ability + floor(level/2)')
            spellsKnown = abilityMod + Math.floor(level / 2);

        spellsKnown = Math.max(spellsKnown, caster.preparation.min);
    } else if (caster.type === 'known') {
        spellsKnown = caster.spellsKnown?.[level] || 0;
    } else if (caster.type === 'spellbook') {
        spellsKnown =
            (caster.spellbook?.starting || 0) +
            (caster.spellbook?.perLevel || 0) * (level - 1);
    }

    return {
        slots,
        cantripsKnown,
        spellsKnown,
        spellAttack: abilityMod + proficiencyBonus,
        spellSaveDC: 8 + abilityMod + proficiencyBonus,
    };
}