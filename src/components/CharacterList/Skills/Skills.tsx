import { memo, useMemo } from 'react';
import type { Characteristics, Skill } from '../../../types/dnd.ts';
import { skillsListSorted } from '../../../constants/TextSkills.ts';
import { getProficiencyBonus } from '../../../utils/getProficiencyBonus.ts';
import { getModifier } from '../../../utils/getModifier.ts';
import styles from './Skills.module.css';

interface SkillsDisplayProps {
    characteristics: Characteristics;
    skills: string[];
    expertise: string[];
    level: number
}

function Skills({ characteristics, skills, expertise, level }: SkillsDisplayProps) {
    const proficiencyBonus = useMemo(() => getProficiencyBonus(level), [level]);

    return (
        <div className={styles.skillsContainer}>
            {skillsListSorted.map((skill: Skill) => {
                const abilityKey = skill.ability as keyof Characteristics;
                const abilityScore = characteristics[abilityKey];
                const abilityMod = getModifier(abilityScore);

                const isProficient = skills.includes(skill.key);
                const isExpert = expertise.includes(skill.key);

                const totalModifier = abilityMod + (isExpert ? proficiencyBonus * 2 : isProficient ? proficiencyBonus : 0);

                return (
                    <div key={skill.key} className={styles.skillWrapper}>
                        <div className={styles.leftSide}>
                            <div className={`${styles.select} ${isExpert ? styles.expertise : isProficient ? styles.selected : ''}`} />
                            <div className={styles.skillName}>{skill.name}</div>
                            <div className={`${isExpert ? styles.expertiseImg : ''}`}/>
                        </div>
                        <div className={styles.rightSide}>
                            <div className={styles.modifer}>
                                {totalModifier >= 0 ? `+${totalModifier}` : totalModifier}
                            </div>
                            <div className={styles.at}>{skill.ability}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default memo(Skills);
