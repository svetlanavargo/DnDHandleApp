import { memo } from 'react';
import styles from './Spells.module.css';

interface SpellsInfo {
    ability: string,
    spellSaveDC: number,
    spellAttack: number
}

function SpellsInfo({ability, spellSaveDC, spellAttack}: SpellsInfo) {
    return(
        <div className={styles.spellsInfoWrapper}>

            <div className={styles.spellCard}>
                <div className={styles.title}>Характеристика</div>
                <div className={styles.value}>{ability}</div>
            </div>

            <div className={styles.spellCard}>
                <div className={styles.title}>Сл спасброска</div>
                <div className={styles.value}>{spellSaveDC}</div>
            </div>

            <div className={styles.spellCard}>
                <div className={styles.title}>Бонус атаки</div>
                <div className={styles.value}>
                    {spellAttack >= 0 ? `+${spellAttack}` : spellAttack}
                </div>
            </div>

        </div>
    )
}

export default memo(SpellsInfo);
