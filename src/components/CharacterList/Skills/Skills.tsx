import type { Characteristics, Skill } from '../../../types/dnd.ts';
import { skillsListSorted } from '../../../constants/TextSkills.ts';
import { getProficiencyBonus } from '../../../utils/getProficiencyBonus.ts';
import { getModifier } from '../../../utils/getModifier.ts';
import styles from './Skills.module.css';

interface SkillsDisplayProps {
    characteristics: Characteristics;
    skills: string[]; // ключи навыков персонажа
    level: number;
    onToggleSkill: (skill: string) => void;
}

function Skills({ characteristics, skills, level }: SkillsDisplayProps) {
    const proficiencyBonus = getProficiencyBonus(level);

    return (
        <div className={styles.skillsContainer}>
            {skillsListSorted.map((skill: Skill) => {
                const abilityKey = skill.ability as keyof Characteristics; // безопасный ключ для TS
                const abilityScore = characteristics[abilityKey];
                const abilityMod = getModifier(abilityScore);
                const isProficient = skills.includes(skill.key);
                const modifier = abilityMod + (isProficient ? proficiencyBonus : 0);

                return (
                    <div key={skill.key} className={styles.skillWrapper}>
                        <div className={styles.leftSide}>
                            <div className={`${styles.select} ${isProficient ? styles.selected : ''}`} />
                            <div className={styles.skillName}>{skill.name}</div>
                        </div>
                        <div className={styles.rightSide}>
                            <div className={styles.modifer}>
                                {modifier > 0 ? `+${modifier}` : modifier}
                            </div>
                            <div className={styles.at}>{String(skill.ability)}</div> {/* конвертируем в строку */}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Skills;