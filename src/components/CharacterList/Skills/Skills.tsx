import type { Characteristics } from '../CharacterList.tsx';
import { getProficiencyBonus } from '../../../utils/getProficiencyBonus.ts';
import { getModifier } from '../../../utils/getModifier.ts';
import styles from './Skills.module.css';

type Skill = {
    key: string
    name: string
    ability: keyof Characteristics
}

interface SkillsProps {
    characteristics: Characteristics
    skills: string[]
    level: number
    onToggleSkill: (skill: string) => void
}

const skillsList: Skill[] = [
    { key: "Athletics", name: "Атлетика", ability: "STR" },
    { key: "Acrobatics", name: "Акробатика", ability: "DEX" },
    { key: "SleightOfHand", name: "Ловкость рук", ability: "DEX" },
    { key: "Stealth", name: "Скрытность", ability: "DEX" },
    { key: "Arcana", name: "Магия", ability: "INT" },
    { key: "History", name: "История", ability: "INT" },
    { key: "Investigation", name: "Анализ", ability: "INT" },
    { key: "Nature", name: "Природа", ability: "INT" },
    { key: "Religion", name: "Религия", ability: "INT" },
    { key: "AnimalHandling", name: "Уход за животными", ability: "WIS" },
    { key: "Insight", name: "Проницательность", ability: "WIS" },
    { key: "Medicine", name: "Медицина", ability: "WIS" },
    { key: "Perception", name: "Восприятие", ability: "WIS" },
    { key: "Survival", name: "Выживание", ability: "WIS" },
    { key: "Deception", name: "Обман", ability: "CHA" },
    { key: "Intimidation", name: "Запугивание", ability: "CHA" },
    { key: "Performance", name: "Выступление", ability: "CHA" },
    { key: "Persuasion", name: "Убеждение", ability: "CHA" }
]

const skillsListSorted = [...skillsList].sort((a, b) =>
    a.name.localeCompare(b.name, 'ru')
)

function Skills({characteristics, skills, level, onToggleSkill}: SkillsProps) {
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
                            <div className={`${styles.select} ${isProficient ? styles.selected : ''}`}
                                 onClick={() => onToggleSkill(skill.key)}
                            />
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