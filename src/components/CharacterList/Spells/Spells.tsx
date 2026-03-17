import { getSpellcastingInfo } from "../../../utils/getSpellcastingInfo.ts"
import SpellSlotsTracker from './SpellSlotsTracker.tsx'
import SpellsInfo from './SpellsInfo'
import styles from './Spells.module.css'

interface SpellsProps {
    character: Character
    updateCharacter: (char: Character) => void
}

function Spells({ character, updateCharacter }: SpellsProps) {
    const info = getSpellcastingInfo(
        character.class,
        character.level,
        character.characteristics,
        character.subclass
    )

    if (!info) return null

    return (
        <div className={styles.spellsContainer}>
            <SpellsInfo
                ability={info.ability}
                spellSaveDC={info.spellSave}
                spellAttack={info.spellAttack}
            />

            <SpellSlotsTracker
                character={character}
                updateCharacter={updateCharacter}
            />
        </div>
    )
}

export default Spells