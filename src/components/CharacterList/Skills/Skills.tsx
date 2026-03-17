import type { Characteristics } from '../../../types/Character.ts';
import { skillsListSorted } from '../../../constants/TextSkills.ts';
import { getProficiencyBonus } from '../../../utils/getProficiencyBonus.ts';
import { getModifier } from '../../../utils/getModifier.ts';
import styles from './Skills.module.css';

type Skill = {
    key: string
    name: string
    ability: keyof Characteristics
}

interface SkillsDisplayProps {
    characteristics: Characteristics,
    skills: Skill,
    level: number,
}

function Skills({ characteristics, skills, level }: SkillsDisplayProps) {
    const proficiencyBonus = getProficiencyBonus(level)

    return (
        <div className={styles.skillsContainer}>
            {skillsListSorted.map(skill => {
                const abilityScore = characteristics[skill.ability]
                const abilityMod = getModifier(abilityScore)
                const isProficient = skills.includes(skill.key)
                const modifier = abilityMod + (isProficient ? proficiencyBonus : 0)

                return (
                    <div key={skill.key} className={styles.skillWrapper}>
                        <div className={styles.leftSide}>
                            <div className={`${styles.select} ${isProficient ? styles.selected : ''}`} />
                            <div className={styles.skillName}>
                                {skill.name}
                            </div>
                        </div>
                        <div className={styles.rightSide}>
                            <div className={styles.modifer}>
                                {modifier > 0 ? `+${modifier}` : modifier}
                            </div>
                            <div className={styles.at}>
                                {skill.ability}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Skills;