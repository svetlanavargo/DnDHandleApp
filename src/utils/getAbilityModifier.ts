import type { Characteristics, Ability } from '../types/dnd.ts';
import { getModifier } from './getModifier.ts';

export const getAbilityModifier = (
    characteristics: Characteristics | undefined,
    abilityKey: Ability
): number => {
    if (!characteristics) {
        console.warn('characteristics is undefined');
        return 0;
    }

    const value = characteristics[abilityKey];

    if (value === undefined) {
        console.warn(`Ability "${abilityKey}" not found in characteristics`);
        return 0;
    }

    return getModifier(value);
};