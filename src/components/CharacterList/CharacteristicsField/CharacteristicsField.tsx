import type { Characteristics } from '../../../types/dnd.ts';
import { getProficiencyBonus } from '../../../utils/getProficiencyBonus.ts';
import { getModifier } from '../../../utils/getModifier.ts';
import classesData from '../../../data/classes.json';
import styles from './CharacteristicsField.module.css';

interface CharacteristicsFieldProps {
    characteristics: Characteristics;
    charClass: string;
    level: number;
}

function CharacteristicsField({ characteristics, level, charClass }: CharacteristicsFieldProps) {
    const savingThrows =
        classesData[charClass as keyof typeof classesData]?.savingThrows ?? [];

    return (
        <div className={styles.characteristicsFieldContainer}>
            {Object.entries(characteristics).map(([key, value]) => {
                const isSelected = savingThrows.includes(key);
                const abilityMod = getModifier(value);
                const proficiencyBonus = getProficiencyBonus(level);
                const savingThrow = abilityMod + (isSelected ? proficiencyBonus : 0);

                return (
                    <div key={key} className={styles.characteristicsFieldWrapper}>
                        <div className={styles.characteristicsField}>
                            <p className={styles.characteristicsFieldName}>{key}</p>
                            <p className={styles.modifier}>
                                {abilityMod > 0 ? `+${abilityMod}` : abilityMod}
                            </p>
                            <p className={styles.characteristicsFieldValue}>{value}</p>
                        </div>

                        <div className={`${styles.savingThrows} ${isSelected ? styles.isSelected : ''}`}>
                            {savingThrow > 0 ? `+${savingThrow}` : savingThrow}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CharacteristicsField;