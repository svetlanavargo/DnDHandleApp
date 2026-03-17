import spellSlotProgression from "../data/Spells/spellSlotProgression.json";
import classes from '../data/Classes/classes.json';

export function getSpellSlots(className: string, level: number) {
    const caster = classes[className]?.caster

    if (!caster) return []

    const progression = caster.progression

    return spellSlotProgression[progression][level] ?? []
}