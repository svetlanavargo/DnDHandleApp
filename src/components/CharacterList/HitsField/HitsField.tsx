import { memo, useState } from 'react';
import {classesData} from '../../../constants/classesData.ts';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './HitsField.module.css';
import type { ClassKey } from '../../../types/dnd';

interface HitsProps {
    hits: number;
    diceHitsCount: number;
    temporaryHits: number;
    currentHits: number;
    charClass: ClassKey;
    addHits: () => void;
    subtractHits: () => void;
    subtractDice: () => void;
}

function HitsField({
                       hits,
                       temporaryHits,
                       diceHitsCount,
                       currentHits,
                       charClass,
                       addHits,
                       subtractHits,
                       subtractDice
                   }: HitsProps) {
    const [activeRolls, setActiveRolls] = useState<boolean[][]>(
        Array(2).fill(null).map(() => Array(3).fill(false))
    );

    const toggleRoll = (lineIndex: number, rollIndex: number) => {
        setActiveRolls(prev => {
            const newState = prev.map(arr => [...arr]);
            newState[lineIndex][rollIndex] = !newState[lineIndex][rollIndex];
            return newState;
        });
    };

    // Берём значение hitDice как строку из JSON
    const diceHits = classesData[charClass]?.hitDice ?? '8';
    const diceNumber = Number(diceHits.replace(/\D/g, '')) || 8;

    const realCurrentHits = temporaryHits + currentHits;

    return (
        <div className={styles.hitsFieldContainer}>
            <div className={styles.hitsWrapper}>
                <div className={styles.hits}>
                    <Btn onClick={addHits} classBtn='addHits' />
                    <div className={styles.hitsCount}>{realCurrentHits}/{hits}</div>
                    <Btn onClick={subtractHits} classBtn='subtractHits' />
                </div>
            </div>

            <div className={styles.hitsWrapper}>
                <div>
                    {activeRolls.map((line, lineIndex) => (
                        <div key={lineIndex} className={styles.lineSaveRoll}>
                            {line.map((isActive, rollIndex) => (
                                <div
                                    key={rollIndex}
                                    className={`${styles.saveRoll} ${isActive ? styles.active : ''}`}
                                    onClick={() => toggleRoll(lineIndex, rollIndex)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles.icons}>
                    <div className={styles.iconAlive} />
                    <div className={styles.iconDied} />
                </div>
            </div>

            <div className={styles.hitsWrapper}>
                <div className={styles.dices}>
                    <div className={styles.diceBtn}>
                        <Btn onClick={subtractDice} classBtn='subtractHits' />
                        <p className={styles.margin}>{diceHitsCount}</p>
                    </div>
                    <div>
                        1d{diceNumber}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(HitsField);
