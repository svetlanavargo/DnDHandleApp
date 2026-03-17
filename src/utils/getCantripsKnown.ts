import { classes } from '../data/Classes/classes.json';

export function getCantripsKnown(className: string, level: number) {
    const caster = classes[className]?.caster

    if (!caster?.cantripsKnown) return 0

    const table = caster.cantripsKnown

    let result = 0

    for (const lvl in table) {
        if (level >= Number(lvl)) {
            result = table[lvl]
        }
    }

    return result
}