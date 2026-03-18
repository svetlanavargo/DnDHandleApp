import spellSlotProgressionData from "../data/Spells/spellSlotProgression.json";
import classesData from '../data/classes.json';
import type { Classes, ClassKey, SpellSlotProgression } from '../types/dnd';

const classes: Classes = classesData as unknown as Classes;
const spellSlotProgression: SpellSlotProgression = spellSlotProgressionData as unknown as SpellSlotProgression;

export function getSpellSlots(className: ClassKey, level: number): number[] {
    const classData = classes[className];
    if (!classData?.caster) return [];

    const caster = classData.caster;
    const progressionType = caster.progression ?? 'full';

    const progression = spellSlotProgression[progressionType] ?? {};

    return progression[level] ?? [];
}