import { memo } from 'react';
import type { Character, CharacterNote } from '../../../types/Character.ts';
import type { ClassKey, RaceKey } from '../../../types/dnd';
import InfoField from '../InfoField/InfoField.tsx';
import Note from '../Note/Note.tsx';
import ListHeader from '../ListHeader/ListHeader.tsx';
import HitsField from '../HitsField/HitsField.tsx';
import CharacteristicsField from '../CharacteristicsField/CharacteristicsField.tsx';
import Skills from '../Skills/Skills.tsx';
import DomainField from '../DomainField/DomainField.tsx';
import Spells from '../Spells/Spells.tsx';
import styles from './List.module.css';

interface ListProps {
    activeCharacter: Character;
    openEditModal: () => void;
    longRest: () => void;
    addHits: () => void;
    subtractHits: () => void;
    subtractDice: () => void;
    isNoteOpen: boolean;
    toggleNoteOpen: () => void;
    updateCharacter: (updated: Character) => void;
    deleteNote: (id: string) => void;
    reorderNotes: (fromId: string, toId: string) => void;
    notes: CharacterNote[];
    activeNoteId: string | null;
    setActiveNote: (id: string | null) => void;
}

function List({
    activeCharacter,
    openEditModal,
    longRest,
    addHits,
    subtractHits,
    subtractDice,
    isNoteOpen,
    toggleNoteOpen,
    updateCharacter,
    deleteNote,
    reorderNotes,
    notes,
    activeNoteId,
    setActiveNote
}: ListProps) {
    const raceKey = activeCharacter.race as RaceKey;
    const classKey = activeCharacter.class as ClassKey;

    return (
        <div className={styles.characterContentWrapper}>
            <div className={styles.characterContent}>
                <div className={styles.headerSection}>
                    <ListHeader
                        name={activeCharacter.name}
                        level={activeCharacter.level}
                        race={raceKey}
                        subrace={activeCharacter.subrace}
                        spec={classKey}
                        charSubclass={activeCharacter.subclass}
                        onEdit={openEditModal}
                        longRest={longRest}
                    />
                </div>

                <div className={styles.noteSection}>
                    <Note
                        character={activeCharacter}
                        updateCharacter={updateCharacter}
                        isOpen={isNoteOpen}
                        toggleOpen={toggleNoteOpen}
                        deleteNote={deleteNote}
                        reorderNotes={reorderNotes}
                        notes={notes}
                        activeNoteId={activeNoteId}
                        setActiveNote={setActiveNote}
                    />
                </div>

                <div className={styles.mobileFlow}>
                    <InfoField
                        speed={activeCharacter.speed}
                        initiative={activeCharacter.initiative}
                        level={activeCharacter.level}
                        ac={activeCharacter.ac}
                        characteristics={activeCharacter.characteristics}
                        proficientSkills={activeCharacter.skills}
                        expertise={activeCharacter.expertise}
                    />

                    <HitsField
                        charClass={activeCharacter.class as ClassKey}
                        hits={activeCharacter.hits}
                        diceHitsCount={activeCharacter.diceHitsCount}
                        temporaryHits={activeCharacter.temporaryHits}
                        currentHits={activeCharacter.currentHits}
                        addHits={addHits}
                        subtractHits={subtractHits}
                        subtractDice={subtractDice}
                    />

                    <CharacteristicsField
                        characteristics={activeCharacter.characteristics}
                        charClass={activeCharacter.class}
                        level={activeCharacter.level}
                    />

                    <Skills
                        characteristics={activeCharacter.characteristics}
                        expertise={activeCharacter.expertise}
                        skills={activeCharacter.skills}
                        level={activeCharacter.level}
                    />

                    <DomainField
                        lang={activeCharacter.languages}
                        armors={activeCharacter.armors}
                        weapons={activeCharacter.weapons}
                        tools={activeCharacter.tools}
                        expertise={activeCharacter.expertise}
                    />

                    <Spells
                        character={activeCharacter}
                        updateCharacter={updateCharacter}
                    />
                </div>

                <div className={styles.desktopLayout}>
                    <div className={styles.desktopLeftColumn}>
                        <CharacteristicsField
                            characteristics={activeCharacter.characteristics}
                            charClass={activeCharacter.class}
                            level={activeCharacter.level}
                        />

                        <Skills
                            characteristics={activeCharacter.characteristics}
                            expertise={activeCharacter.expertise}
                            skills={activeCharacter.skills}
                            level={activeCharacter.level}
                        />
                    </div>

                    <div className={styles.desktopRightColumn}>
                        <InfoField
                            speed={activeCharacter.speed}
                            initiative={activeCharacter.initiative}
                            level={activeCharacter.level}
                            ac={activeCharacter.ac}
                            characteristics={activeCharacter.characteristics}
                            proficientSkills={activeCharacter.skills}
                            expertise={activeCharacter.expertise}
                        />

                        <HitsField
                            charClass={activeCharacter.class as ClassKey}
                            hits={activeCharacter.hits}
                            diceHitsCount={activeCharacter.diceHitsCount}
                            temporaryHits={activeCharacter.temporaryHits}
                            currentHits={activeCharacter.currentHits}
                            addHits={addHits}
                            subtractHits={subtractHits}
                            subtractDice={subtractDice}
                        />

                        <Note
                            character={activeCharacter}
                            updateCharacter={updateCharacter}
                            isOpen={isNoteOpen}
                            toggleOpen={toggleNoteOpen}
                            deleteNote={deleteNote}
                            reorderNotes={reorderNotes}
                            notes={notes}
                            activeNoteId={activeNoteId}
                            setActiveNote={setActiveNote}
                        />

                        <DomainField
                            lang={activeCharacter.languages}
                            armors={activeCharacter.armors}
                            weapons={activeCharacter.weapons}
                            tools={activeCharacter.tools}
                            expertise={activeCharacter.expertise}
                        />

                        <Spells
                            character={activeCharacter}
                            updateCharacter={updateCharacter}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(List);
