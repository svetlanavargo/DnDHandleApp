import type { Character } from '../../../types/Character.ts';
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
    onToggleSkill: (skill: string) => void;
    openEditModal: () => void;
    longRest: () => void;
    addHits: () => void;
    subtractHits: () => void;
    subtractDice: () => void;

    noteText: string;
    isNoteOpen: boolean;
    toggleNoteOpen: () => void;
    updateCharacter: (updated: Character) => void;
}

function List({
                  activeCharacter,
                  removeCharacter,
                  onToggleSkill,
                  openEditModal,
                  longRest,
                  addHits,
                  subtractHits,
                  subtractDice,
                  isNoteOpen,
                  toggleNoteOpen,
                  updateCharacter
              }: ListProps) {
    return (
        <div className={styles.characterContentWrapper}>
            <div className={styles.characterContent}>
                <ListHeader
                    name={activeCharacter.name}
                    level={activeCharacter.level}
                    race={activeCharacter.race}
                    spec={activeCharacter.class}
                    charSubclass={activeCharacter.subclass}
                    onEdit={openEditModal}
                    longRest={longRest}
                />

                <Note
                    text={activeCharacter.note || ''}
                    isOpen={isNoteOpen}
                    toggleOpen={toggleNoteOpen}
                    character={activeCharacter}
                    updateCharacter={updateCharacter}
                />

                <InfoField
                    speed={activeCharacter.speed}
                    initiative={activeCharacter.initiative}
                    level={activeCharacter.level}
                    ac={activeCharacter.ac}
                />

                <HitsField
                    charClass={activeCharacter.class}
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
                    skills={activeCharacter.skills}
                    onToggleSkill={onToggleSkill}
                    level={activeCharacter.level}
                />

                <DomainField
                    lang={activeCharacter.languages}
                    armors={activeCharacter.armors}
                    weapons={activeCharacter.weapons}
                    tools={activeCharacter.tools}
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

export default List;