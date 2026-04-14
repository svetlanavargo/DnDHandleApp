import { useState, useContext } from 'react';
import { CharacterContext } from '../../context/CharacterContext';
import { useNumberModal } from '../../hooks/useNumberModal.ts';
import {spellSlotProgression} from '../../constants/spellSlotProgression.ts';
import {classesData} from '../../constants/classesData.ts';
import { getModifier } from '../../utils/getModifier';
import type { Classes, ClassKey, ProgressionType, SpellSlotsState } from '../../types/dnd';
import type { Character } from '../../types/Character.ts';
import EmptyState from '../UI/EmptyState/EmptyState.tsx';
import Tabs from '../UI/Tabs/Tabs';
import List from './List/List';
import Modal from '../Modals/Modal.tsx';
import ChangeHitsModal from '../Modals/ChangeHitsModal.tsx';
import DeleteCharacter from '../Modals/Delete.tsx';
import CharacterModal from '../Modals/CharacterModal';
import styles from './CharacterList.module.css';

const classes: Classes = classesData as unknown as Classes;

export default function CharacterList() {
    const { characters, activeCharacterId, setActiveCharacterId, addCharacter, updateCharacter, removeCharacter: removeCharacterFromContext } = useContext(CharacterContext);

    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);
    const [creatingCharacter, setCreatingCharacter] = useState(false);
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [activeNoteIndex, setActiveNoteIndex] = useState(0);
    const [deleteNoteIndex, setDeleteNoteIndex] = useState<number | null>(null);

    const numberModal = useNumberModal();
    const activeCharacter = characters.find(c => c.id === activeCharacterId) ?? null;

    const closeDeleteModal = () => setDeletingCharacter(null);
    const closeEditModal = () => setEditingCharacter(null);

    // === Add Character ===
    const handleAddCharacter = () => {
        if (characters.length >= 6) return;
        setCreatingCharacter(true);
    };

    // === Save Character ===
    const saveCharacter = (updated: Character) => {
        let spellSlots = updated.spellSlots;

        const exists = characters.find(c => c.id === updated.id);
        if (
            !exists ||
            exists.class !== updated.class ||
            exists.subclass !== updated.subclass ||
            exists.level !== updated.level
        ) {
            spellSlots = initSpellSlots(updated.class as ClassKey, updated.subclass, updated.level);
        }

        const updatedCharacter: Character = { ...updated, spellSlots };
        updateCharacter(updatedCharacter);
        closeEditModal();
    };

    // === Spell Slots ===
    function initSpellSlots(className: ClassKey, subclassName: string | undefined, level: number): SpellSlotsState {
        const classData = classes[className];
        if (!classData) return {};

        let caster = classData.caster ?? null;
        if (subclassName && classData.subclasses) {
            const subclassData = classData.subclasses[subclassName];
            if (subclassData?.caster) caster = subclassData.caster;
        }

        if (!caster) return {};

        const progressionType: ProgressionType = caster.progression ?? 'full';
        const progression = spellSlotProgression[progressionType] ?? {};
        const slotsPerLevel = progression[level] ?? [];

        const state: SpellSlotsState = {};
        slotsPerLevel.forEach((count, i) => {
            state[i + 1] = Array(count).fill(false);
        });

        return state;
    }

    // === HP / Dice / Rest ===
    const addHits = () => {
        if (!activeCharacter) return;

        numberModal.openModal({
            title: `Прибавить хиты ${activeCharacter.name}`,
            min: 0,
            max: 1000,
            onConfirm: (amount) => {
                if (amount <= 0) return;
                const updated: Character = { ...activeCharacter };
                const newCurrent = updated.currentHits + amount;

                if (newCurrent <= updated.hits) {
                    updated.currentHits = newCurrent;
                } else {
                    updated.currentHits = updated.hits;
                    updated.temporaryHits += newCurrent - updated.hits;
                }

                updateCharacter(updated);
            }
        });
    };

    const subtractHits = () => {
        if (!activeCharacter) return;

        numberModal.openModal({
            title: `Снять хиты у ${activeCharacter.name}`,
            min: 0,
            max: 1000,
            onConfirm: (amount) => {
                if (amount <= 0) return;
                const updated: Character = { ...activeCharacter };
                let damage = amount;

                const tempDamage = Math.min(updated.temporaryHits, damage);
                updated.temporaryHits -= tempDamage;
                damage -= tempDamage;

                updated.currentHits = Math.max(0, updated.currentHits - damage);

                updateCharacter(updated);
            }
        });
    };

    const subtractDice = () => {
        if (!activeCharacter) return;

        const hitDiceValue = classes[activeCharacter.class as ClassKey]?.hitDice;
        if (!hitDiceValue || activeCharacter.diceHitsCount <= 0) return;

        const roll = Math.floor(Math.random() * Number(hitDiceValue) + 1);
        const totalHeal = roll + getModifier(activeCharacter.characteristics.CON);

        const updated: Character = {
            ...activeCharacter,
            diceHitsCount: activeCharacter.diceHitsCount - 1,
            currentHits: Math.min(activeCharacter.hits, activeCharacter.currentHits + totalHeal)
        };
        updateCharacter(updated);
    };

    const longRest = () => {
        if (!activeCharacter) return;

        const updated: Character = {
            ...activeCharacter,
            currentHits: activeCharacter.hits,
            temporaryHits: 0,
            diceHitsCount: Math.min(activeCharacter.level, activeCharacter.diceHitsCount + Math.max(1, Math.floor((activeCharacter.level - activeCharacter.diceHitsCount)/2))),
            spellSlots: Object.fromEntries(
                Object.entries(activeCharacter.spellSlots ?? {}).map(([lvl, slots]) => [Number(lvl), slots.map(() => false)])
            )
        };
        updateCharacter(updated);
    };

    const addNote = () => {
        if (!activeCharacter) return;
        const updatedNotes = [...(activeCharacter.note || []), ''];
        updateCharacter({ ...activeCharacter, note: updatedNotes });
        setActiveNoteIndex(updatedNotes.length - 1);
    };

    const requestDeleteNote = (index: number) => {
        setDeleteNoteIndex(index);
    };

    const confirmDeleteNote = () => {
        if (deleteNoteIndex === null || !activeCharacter) return;

        const updatedNotes = [...(activeCharacter.note || [])];
        updatedNotes.splice(deleteNoteIndex, 1);

        updateCharacter({ ...activeCharacter, note: updatedNotes });
        setDeleteNoteIndex(null);
    };

    // === Remove Character ===
    const handleRemoveCharacter = (id: string) => {
        removeCharacterFromContext(id);
        closeDeleteModal();
    };


    return (
        <div className={styles.characterListContainer}>
            {!activeCharacter ?
                (<EmptyState
                    image={<div className={styles.img} />}
                    title="Привет игрок!"
                    text="Для создания листа персонажа нажми"
                    buttonText="Создать"
                    onButtonClick={() => setCreatingCharacter(true)}
                />) :
                (<div className={styles.characterList}>
            <Tabs
                items={characters.map(c => ({
                    id: c.id,
                    label: c.name
                }))}
                activeId={activeCharacterId ?? ''}
                setActive={setActiveCharacterId}
                onAdd={handleAddCharacter}
            />

            {activeCharacter &&
                <List
                    activeCharacter={activeCharacter}
                    removeCharacter={() => setDeletingCharacter(activeCharacter)}
                    openEditModal={() => setEditingCharacter(activeCharacter)}
                    addHits={addHits}
                    subtractHits={subtractHits}
                    subtractDice={subtractDice}
                    longRest={longRest}
                    isNoteOpen={isNoteOpen}
                    toggleNoteOpen={() => setIsNoteOpen(prev => !prev)}
                    updateCharacter={saveCharacter}
                    addNote={addNote}
                    deleteNote={requestDeleteNote}
                    setActiveNote={setActiveNoteIndex}
                    activeIndex={activeNoteIndex}
                />
            }
        </div>)}

            <Modal isOpen={numberModal.isOpen} size="small">
                <ChangeHitsModal
                    title={numberModal.title}
                    min={numberModal.min}
                    max={numberModal.max}
                    onConfirm={(value) => numberModal.onConfirm?.(value)}
                    onClose={numberModal.closeModal}
                />
            </Modal>

            {creatingCharacter && (
                <Modal isOpen={creatingCharacter} size="small">
                    <CharacterModal
                        character={null}
                        onClose={() => setCreatingCharacter(false)}
                        onSave={(newChar) => {
                            addCharacter(newChar);
                            setCreatingCharacter(false);
                        }}
                    />
                </Modal>
            )}

            {editingCharacter && (
                <Modal isOpen={!!editingCharacter} size="small">
                    <CharacterModal
                        character={editingCharacter}
                        onClose={closeEditModal}
                        onSave={saveCharacter}
                    />
                </Modal>
            )}

            {deleteNoteIndex !== null && (
                <Modal isOpen={true} size="small">
                    <DeleteCharacter
                        name="заметку"
                        onClose={() => setDeleteNoteIndex(null)}
                        remove={confirmDeleteNote}
                    />
                </Modal>
            )}

            {deletingCharacter && (
                <Modal isOpen={!!deletingCharacter} size="small">
                    <DeleteCharacter
                        remove={() => handleRemoveCharacter(deletingCharacter.id)}
                        onClose={closeDeleteModal}
                        name={deletingCharacter.name}
                    />
                </Modal>
            )}
        </div>
    );
}