import { useState } from "react";
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './Spells.module.css';

interface Props {
    character: Character
    updateCharacter: (char: Character) => void
}

function SpellSlotsTracker({ character, updateCharacter }: Props) {
    const [editMode, setEditMode] = useState(false);

    if (!character.spellSlots) return null

    const toggleSlot = (lvl: number, index: number) => {
        const slots = { ...character.spellSlots }

        const levelSlots = [...slots[lvl]]

        const isUsed = levelSlots[index]

        if (isUsed && !editMode) return

        levelSlots[index] = !isUsed

        slots[lvl] = levelSlots

        updateCharacter({
            ...character,
            spellSlots: slots
        })
    }


    return (
        <div className={styles.spellsSlotsWrapper}>
            <div className={styles.flex}>
                <p className={styles.title}>
                    Ячейки заклинаний {editMode && "(ред.)"}
                </p>

                {editMode ?
                    (
                        <Btn onClick={() => setEditMode(prev => !prev)}
                             classBtn='saveNote'
                        />
                ) : (
                        <Btn
                            onClick={() => setEditMode(prev => !prev)}
                            classBtn='edit'
                        />
                    )
                }
            </div>

            <div className={styles.spellsSlots}>
                {Object.entries(character.spellSlots).map(([lvl, slots]) => (
                    <div key={lvl} className={styles.col}>
                        <p className={styles.level}>{lvl}</p>

                        <div className={styles.slotsWrapper}>
                            {slots.map((used, i) => (
                                <div
                                    key={i}
                                    className={`${styles.slot} ${used ? styles.used : ""}`}
                                    onClick={() => toggleSlot(Number(lvl), i)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SpellSlotsTracker;