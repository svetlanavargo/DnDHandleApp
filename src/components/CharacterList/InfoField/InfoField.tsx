import { memo, useMemo } from 'react';
import { getProficiencyBonus } from "../../../utils/getProficiencyBonus.ts";
import { getSkillModifier } from "../../../utils/getSkillModifier.ts";
import type { Characteristics } from "../../../types/dnd.ts";
import styles from './InfoField.module.css';

interface InfoFieldProps {
    speed: number;
    level: number;
    initiative: number;
    ac: number;
    characteristics: Characteristics;
    proficientSkills: string[];
    expertise: string[];
}

function InfoField({
                       speed,
                       initiative,
                       level,
                       ac,
                       characteristics,
                       proficientSkills,
                       expertise
                   }: InfoFieldProps) {
    const proficiencyBonus = useMemo(() => getProficiencyBonus(level), [level]);
    const perception = useMemo(() => getSkillModifier(
        "Perception",
        characteristics,
        level,
        proficientSkills
    ), [characteristics, level, proficientSkills]);
    const hasPerceptionExpertise = expertise.includes('Perception');
    const PassPerception = 10 + perception + (hasPerceptionExpertise ? proficiencyBonus : 0)

    return (
        <div className={styles.infoFieldContainer}>
            <div className={styles.infoWrapper}>
                <div className={styles.proficiencyBonus}>
                    {proficiencyBonus}
                </div>
                <p className={styles.text}>Бонус мастерства</p>
            </div>

            <div className={styles.infoWrapper}>
                <div className={styles.initiative}>
                    {initiative}
                </div>
                <p className={styles.text}>Инициатива</p>
            </div>

            <div className={styles.infoWrapper}>
                <div className={styles.speed}>
                    {speed}
                </div>
                <p className={styles.text}>Скорость</p>
            </div>

            <div className={styles.infoWrapper}>
                <div className={styles.ac}>
                    {ac}
                </div>
                <p className={styles.text}>Класс Брони</p>
            </div>

            <div className={styles.infoWrapper}>
                <div className={styles.perception}>
                    {PassPerception}
                </div>
                <p className={styles.text}>Восприятие</p>
            </div>
        </div>
    );
}

export default memo(InfoField);
