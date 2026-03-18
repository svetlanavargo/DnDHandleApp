import type { ClassKey } from '../types/dnd';
import classes from '../data/classes.json';

export function getCantripsKnown(className: ClassKey, level: number) {
    const caster = classes[className]?.caster;

    if (!caster?.cantripsKnown) return 0;

    const table = caster.cantripsKnown;

    let result = 0;

    for (const lvl in table) {
        if (level >= Number(lvl)) {
            result = table[lvl as keyof typeof table]; // ✅ приведение к ключу
        }
    }

    return result;
}