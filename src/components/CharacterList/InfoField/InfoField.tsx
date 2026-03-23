import { getProficiencyBonus} from "../../../utils/getProficiencyBonus.ts";
import styles from './InfoField.module.css';

interface InfofieldProps {
    speed: number,
    level: number,
    initiative: number,
    ac: number
}

function InfoField({speed, initiative, level, ac}: InfofieldProps) {
    const proficiencyBonus = getProficiencyBonus(level)
    return(
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
        </div>
    )
}

export default InfoField;