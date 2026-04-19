import { memo } from 'react';
import type { Character } from '../../../types/Character.ts';
import type { ClassKey, RaceKey } from '../../../types/dnd';
import InfoField from '../InfoField/InfoField.tsx';
import Note from '../Note/Note.tsx';
import ListHeader from '../ListHeader/ListHeader.tsx';
import HitsField from '../HitsField/HitsField.tsx';
import CharacteristicsField from '../CharacteristicsField/CharacteristicsField.tsx';
import Skills from '../Skills/Skills.tsx';
import DomainField from '../DomainField/DomainField.tsx';
import Spells from '../Spells/Spells.tsx';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './List.module.css';

interface ListProps {
    activeCharacter: Character;
    removeCharacter: () => void;
    openEditModal: () => void;
    longRest: () => void;
    addHits: () => void;
    subtractHits: () => void;
    subtractDice: () => void;
    isNoteOpen: boolean;
    toggleNoteOpen: () => void;
    updateCharacter: (updated: Character) => void;
    addNote: () => void;
    deleteNote: (index: number) => void;
    activeIndex: number;
    setActiveNote: (index: number) => void;
}

function List({
                                 activeCharacter,
                                 removeCharacter,
                                 openEditModal,
                                 longRest,
                                 addHits,
                                 subtractHits,
                                 subtractDice,
                                 isNoteOpen,
                                 toggleNoteOpen,
                                 updateCharacter,
                                 addNote,
                                 deleteNote,
                                 activeIndex,
                                 setActiveNote
                             }: ListProps) {
    const raceKey = activeCharacter.race as RaceKey;
    const classKey = activeCharacter.class as ClassKey;

    return (
        <div className={styles.characterContentWrapper}>
            <div className={styles.characterContent}>
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

                <Note
                    character={activeCharacter}
                    updateCharacter={updateCharacter}
                    isOpen={isNoteOpen}
                    toggleOpen={toggleNoteOpen}
                    addNote={addNote}
                    deleteNote={deleteNote}
                    activeIndex={activeIndex}
                    setActiveNote={setActiveNote}
                />

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

                <div className={styles.delete}>
                    <Btn onClick={removeCharacter} classBtn="delete" />
                </div>
            </div>
        </div>
    );
}

export default memo(List);
