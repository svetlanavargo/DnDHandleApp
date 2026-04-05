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
}

function InfoField({
                       speed,
                       initiative,
                       level,
                       ac,
                       characteristics,
                       proficientSkills
                   }: InfoFieldProps) {
    const proficiencyBonus = getProficiencyBonus(level);

    const perception = getSkillModifier(
        "Perception",
        characteristics,
        level,
        proficientSkills
    );

    const PassPerception = 10 + perception

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

export default InfoField;