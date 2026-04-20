import { useContext, useMemo, useState } from 'react';
import {classesData} from '../../constants/classesData.ts';
import { useAuth } from '../../context/auth/useAuth.ts';
import Tabs from '../UI/Tabs/Tabs.tsx';
import SpellsMenu from './SpellsMenu/SpellsMenu.tsx';
import SpellsListView from './SpellsListView/SpellsListView.tsx';
import Modal from '../Modals/Modal.tsx';
import SpellsAddCard from '../Modals/SpellsAddCard.tsx';
import SpellsDeleteCard from '../Modals/SpellsDeleteCard.tsx';
import SpellsSettings from '../Modals/SpellsSettings.tsx';
import EmptyState from '../UI/EmptyState/EmptyState.tsx';
import Warning from '../UI/Warning/Warning.tsx';
import { CharacterContext } from '../../context/CharacterContext.ts';
import rawSpellsJson from '../../data/Spells/spells.json';

import type { Spell, SpellSchool, SpellLevel } from '../../types/dnd';
import styles from './SpellsList.module.css';

type ModalType = "add" | "delete" | "settings" | null;
const ALL_SPELL_LEVELS: SpellLevel[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function createEmptySpellGroups(): Record<SpellLevel, Spell[]> {
    return {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
        '8': [],
        '9': []
    };
}

function getMaxSpellLevel(
    level: number,
    classKey?: keyof typeof classesData,
    subclass?: string
): number {
    if (!classKey) return 0;

    const classData = classesData[classKey];

    const caster =
        subclass &&
        classData?.subclasses?.[subclass]?.caster
            ? classData.subclasses[subclass].caster
            : classData?.caster;

    if (!caster?.maxSpellLevel) return 0;

    const levels = Object.keys(caster.maxSpellLevel)
        .map(Number)
        .filter((currentLevel) => currentLevel <= level);

    if (!levels.length) return 0;

    const bestLevel = Math.max(...levels);

    return caster.maxSpellLevel[bestLevel] ?? 0;
}

function SpellsList() {
    const { user } = useAuth();
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [activeTab, setActiveTab] = useState<SpellLevel>('0');
    const [addModalLevel, setAddModalLevel] = useState<SpellLevel | undefined>(undefined);
    const { characters, activeCharacterId, updateCharacter } = useContext(CharacterContext);

    const activeCharacter = characters.find(c => c.id === activeCharacterId) ?? null;

    const spellsJson = rawSpellsJson as Spell[];

    const spellsMap = useMemo(() => {
        return Object.fromEntries(
            spellsJson.map((s) => [s.url, s])
        );
    }, [spellsJson]);

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

    const preparedDesktopSpells = useMemo(() => {
        if (!activeCharacter?.spells) {
            return {};
        }

        const maxSpellLevel = getMaxSpellLevel(
            activeCharacter.level,
            activeCharacter.class,
            activeCharacter.subclass
        );

        const visibleLevels = ALL_SPELL_LEVELS.filter(
            (level) => level === '0' || Number(level) <= maxSpellLevel
        );

        const preparedGroups = createEmptySpellGroups();

        visibleLevels.forEach((level) => {
            const levelSpells = activeCharacter.spells?.[level] || [];

            preparedGroups[level] = levelSpells
                .map((url: string) => spellsMap[url])
                .filter((spell: Spell | undefined): spell is Spell => Boolean(spell))
                .map((spell) => ({
                    ...spell,
                    school: spell.school as SpellSchool
                }));
        });

        return Object.fromEntries(
            visibleLevels.map((level) => [level, preparedGroups[level]])
        ) as Partial<Record<SpellLevel, Spell[]>>;
    }, [activeCharacter, spellsMap]);

    if (!activeCharacter) {
        return <EmptyState
            image={<div className={styles.img} />}
            text="Для просмотра заклинаний - необходимо "
            linkText="создать персонажа"
            linkTo="/character_list"
        />
    }


    if (!activeCharacter.spells || Object.keys(activeCharacter.spells).length === 0) {
        return <EmptyState
            classIcon={{
                spec: activeCharacter.class,
                size: 'big'
            }}
            title="К сожалению (или к счастью?)"
            text={`твой персонаж ${classesData[activeCharacter.class].name} не может использовать заклинания`}
        />
    }

    const openModal = (type: ModalType, level?: SpellLevel) => {
        setAddModalLevel(type === 'add' ? level : undefined);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setAddModalLevel(undefined);
    };

    function getSpellLevelLabel(level: SpellLevel): string {
        if (level === "0") return "Заговоры";
        return `${level}`;
    }

    const spellEntries = Object.entries(
        activeCharacter.spells ?? {}
    ) as [SpellLevel, string[]][];

    return (
        <div className={styles.spellsContainer}>
            <div className={styles.pageShell}>
                {!user && <Warning />}
                <div className={styles.spellsWrap}>
                    <SpellsMenu
                        onAdd={() => openModal("add")}
                        onDelete={() => openModal("delete")}
                        onSettings={() => openModal("settings")}
                    />

                    <div className={styles.tabsShell}>
                        <Tabs
                            items={spellEntries.map(([level]) => ({
                                id: level,
                                label: getSpellLevelLabel(level)
                            }))}
                            activeId={activeTab}
                            setActive={(id) => setActiveTab(id as SpellLevel)}
                        />
                    </div>

                    <SpellsListView
                        spells={preparedSpells}
                        fill={activeCharacter.fill}
                        groupedSpells={preparedDesktopSpells}
                        onEmptyStackClick={(level) => openModal('add', level)}
                    />
                </div>
            </div>

            <Modal isOpen={activeModal === "add"} size="small">
                <SpellsAddCard
                    handleModalToggle={closeModal}
                    character={activeCharacter}
                    updateCharacter={updateCharacter}
                    initialLevel={addModalLevel}
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
