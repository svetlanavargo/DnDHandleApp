import type { Characteristics } from '../types/dnd';
import { skillsList } from '../constants/TextSkills';
import { getAbilityModifier } from './getAbilityModifier';
import { getProficiencyBonus } from './getProficiencyBonus';

export const getSkillModifier = (
    skillKey: string,
    characteristics: Characteristics,
    level: number,
    proficientSkills: string[] = []
): number => {
    const skill = skillsList.find(s => s.key === skillKey);

    if (!skill) {
        console.warn(`Skill "${skillKey}" not found`);
        return 0;
    }

    const abilityMod = getAbilityModifier(characteristics, skill.ability);
    const proficiencyBonus = getProficiencyBonus(level);
    const isProficient = proficientSkills.includes(skillKey);

    return abilityMod + (isProficient ? proficiencyBonus : 0);
};