import { useContext, useMemo, useState } from 'react';
import Tabs from '../UI/Tabs/Tabs.tsx';
import SpellsMenu from './SpellsMenu/SpellsMenu.tsx';
import SpellsListView from './SpellsListView/SpellsListView.tsx';
import Modal from '../Modals/Modal.tsx';
import SpellsAddCard from '../Modals/SpellsAddCard.tsx';
import SpellsDeleteCard from '../Modals/SpellsDeleteCard.tsx';
import SpellsSettings from '../Modals/SpellsSettings.tsx';
import NoSlots from '../Stubs/NoSlots/NoSlots.tsx';
import { CharacterContext } from '../../context/CharacterContext.ts';
import rawSpellsJson from '../../data/Spells/spells.json';

import type { Spell, SpellSchool, SpellLevel } from '../../types/dnd';
import styles from './SpellsList.module.css';
import NoCharacter from "../Stubs/NoCharacter/NoCharacter.tsx";

type ModalType = "add" | "delete" | "settings" | null;

function SpellsList() {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [activeTab, setActiveTab] = useState<SpellLevel>('0');
    const { characters, activeCharacterId, updateCharacter } = useContext(CharacterContext);

    const activeCharacter = characters.find(c => c.id === activeCharacterId) ?? null;

    const spellsJson = rawSpellsJson as Spell[];

    // map url → spell
    const spellsMap = useMemo(() => {
        return Object.fromEntries(
            spellsJson.map((s) => [s.url, s])
        );
    }, [spellsJson]);

    // 👉 подготовленные спеллы по выбранному уровню
    const preparedSpells = useMemo(() => {
        if (!activeCharacter?.spells) return [];

        const levelSpells = activeCharacter.spells[activeTab] || [];

        return levelSpells
            .map((url: string) => spellsMap[url])
            .filter((spell: Spell | undefined): spell is Spell => Boolean(spell))
            .map((spell) => ({
                ...spell,
                school: spell.school as SpellSchool
            }));
    }, [activeCharacter, activeTab, spellsMap]);

    if (!activeCharacter) {
        return <NoCharacter text='Для просмотра заклинаний - необходимо '/>;
    }


    if (!activeCharacter.spells || Object.keys(activeCharacter.spells).length === 0) {
        return <NoSlots chClass={activeCharacter.class}/>;
    }

    const openModal = (type: ModalType) => setActiveModal(type);
    const closeModal = () => setActiveModal(null);

    function getSpellLevelLabel(level: SpellLevel): string {
        if (level === "0") return "Заговоры";
        return `${level}`;
    }

    const spellEntries = Object.entries(
        activeCharacter.spells ?? {}
    ) as [SpellLevel, string[]][];

    return (
        <div className={styles.spellsContainer}>
            <div className={styles.spellsWrap}>
                <SpellsMenu
                    onAdd={() => openModal("add")}
                    onDelete={() => openModal("delete")}
                    onSettings={() => openModal("settings")}
                />

                <Tabs
                    items={spellEntries.map(([level]) => ({
                        id: level,
                        label: getSpellLevelLabel(level)
                    }))}
                    activeId={activeTab}
                    setActive={(id) => setActiveTab(id as SpellLevel)}
                />

                <SpellsListView
                    spells={preparedSpells}
                    fill={activeCharacter.fill}
                />
            </div>

            <Modal isOpen={activeModal === "add"} size="small">
                <SpellsAddCard
                    handleModalToggle={closeModal}
                    character={activeCharacter}
                    updateCharacter={updateCharacter}
                />
            </Modal>

            <Modal isOpen={activeModal === "delete"} size="small">
                <SpellsDeleteCard
                    handleModalToggle={closeModal}
                    character={activeCharacter}
                    updateCharacter={updateCharacter}
                />
            </Modal>

            <Modal isOpen={activeModal === "settings"} size="small">
                <SpellsSettings
                    handleModalToggle={closeModal}
                    character={activeCharacter}
                    updateCharacter={updateCharacter}
                />
            </Modal>
        </div>
    );
}

export default SpellsList;