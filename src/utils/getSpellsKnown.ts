import classesData from '../data/classes.json';
import type { Classes, ClassKey } from '../types/dnd';

const classes: Classes = classesData as unknown as Classes;

export function getSpellsKnown(className: ClassKey, level: number): number | null {
    const classData = classes[className];
    if (!classData) return null;

    const caster = classData.caster;
    if (!caster?.spellsKnown) return null;

    return caster.spellsKnown[level.toString()] ?? 0;
}