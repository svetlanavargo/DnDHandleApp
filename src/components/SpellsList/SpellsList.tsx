import { useContext, useEffect, useState } from 'react';
import SpellsTabs from './SpellsTabs/SpellsTabs.tsx';
import SpellsListView from './SpellsListView/SpellsListView.tsx';
import type { Spell } from '../../types/dnd.ts';
import { CharacterContext } from '../../context/CharacterContext.ts';
import spellsRaw from '../../data/Spells/spells.json';
import styles from './SpellsList.module.css';

const spells = spellsRaw as Spell[];

function SpellsList() {
    const [activeTab, setActiveTab] = useState<string>('0');
    const { characters, activeCharacterId } = useContext(CharacterContext);

    const activeCharacter = characters.find(c => c.id === activeCharacterId) ?? null;

    useEffect(() => {
        if (!activeCharacter) return;
    }, [activeCharacter]);

    console.log(activeCharacter);

    if (!activeCharacter) return null;

    if (!activeCharacter.spellSlots || Object.keys(activeCharacter.spellSlots).length === 0) {
        return <div>нет слотов</div>;
    }

    const filteredSpells = spells.filter(
        spell => String(spell.lvl) === activeTab
    );

    return (
        <div className={styles.spellsContainer}>
            <div className={styles.spellsWrap}>
                <SpellsTabs
                    slots={activeCharacter.spellSlots}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />

                <SpellsListView
                    spells={filteredSpells}
                    fill={activeCharacter.fill}
                />
            </div>
        </div>
    );
}

export default SpellsList;