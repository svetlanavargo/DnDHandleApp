import classesData from '../data/classes.json';
import { getModifier } from './getModifier';
import { getProficiencyBonus } from './getProficiencyBonus';
import type { ClassKey, Classes, Characteristics } from '../types/dnd';

const classes: Classes = classesData as unknown as Classes;

interface SpellcastingInfo {
    ability: keyof Characteristics;
    modifier: number;
    spellAttack: number;
    spellSave: number;
}

interface SimpleCaster {
    ability: keyof Characteristics;
}

export function getSpellcastingInfo(
    className: ClassKey,
    level: number,
    characteristics: Characteristics,
    subclass?: string
): SpellcastingInfo | null {
    const classData = classes[className];
    if (!classData) return null;

    let casterData: SimpleCaster | undefined = undefined;

    // основной кастер
    if (classData.caster?.ability) {
        casterData = { ability: classData.caster.ability as keyof Characteristics };
    }

    // проверка подклассов
    const subclassCasters: Record<string, keyof Characteristics> = {
        arcane_trickster: 'INT',
        eldritch_knight: 'INT'
    };

    if (!casterData && subclass && subclassCasters[subclass]) {
        casterData = { ability: subclassCasters[subclass] };
    }

    if (!casterData) return null;

    const ability = casterData.ability;
    const abilityScore = characteristics[ability];
    const modifier = getModifier(abilityScore);
    const proficiency = getProficiencyBonus(level);

    return {
        ability,
        modifier,
        spellAttack: modifier + proficiency,
        spellSave: 8 + modifier + proficiency
    };
}