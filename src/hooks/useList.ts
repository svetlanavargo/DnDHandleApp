import { useCallback, useContext, useMemo, useState } from 'react';
import { CharacterContext } from '../context/CharacterContext';
import { useNumberModal } from './useNumberModal.ts';

import { spellSlotProgression } from '../constants/spellSlotProgression';
import { classesData } from '../constants/classesData';
import { getModifier } from '../utils/getModifier';
import {
    createCharacterNote,
    normalizeCharacterNotes,
    reorderCharacterNotes
} from '../utils/characterNotes';

import type { Character } from '../types/Character';
import type { ClassKey, Classes, ProgressionType, SpellSlotsState } from '../types/dnd';

const classes: Classes = classesData as unknown as Classes;

export function useList() {
    const {
        characters,
        activeCharacterId,
        setActiveCharacterId,
        addCharacter,
        updateCharacter,
        removeCharacter
    } = useContext(CharacterContext);

    const numberModal = useNumberModal();

    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [deletingCharacter, setDeletingCharacter] = useState<Character | null>(null);
    const [creatingCharacter, setCreatingCharacter] = useState(false);

    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

    const activeCharacter =
        characters.find(c => c.id === activeCharacterId) ?? null;
    const normalizedNotes = normalizeCharacterNotes(activeCharacter?.note);
    const resolvedActiveNoteId = activeNoteId && normalizedNotes.some(note => note.id === activeNoteId)
        ? activeNoteId
        : normalizedNotes[0]?.id ?? null;

    const closeDeleteModal = useCallback(() => setDeletingCharacter(null), []);
    const closeEditModal = useCallback(() => setEditingCharacter(null), []);

    const handleAddCharacter = useCallback(() => {
        if (characters.length >= 6) return;
        setCreatingCharacter(true);
    }, [characters.length]);

    const initSpellSlots = useCallback((
        className: ClassKey,
        subclassName: string | undefined,
        level: number
    ) => {
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
    }, []) as (
        className: ClassKey,
        subclassName: string | undefined,
        level: number
    ) => SpellSlotsState;

    const saveCharacter = useCallback((updated: Character) => {
        let spellSlots = updated.spellSlots;

        const exists = characters.find(c => c.id === updated.id);

        if (
            !exists ||
            exists.class !== updated.class ||
            exists.subclass !== updated.subclass ||
            exists.level !== updated.level
        ) {
            spellSlots = initSpellSlots(
                updated.class as ClassKey,
                updated.subclass,
                updated.level
            );
        }

        updateCharacter({ ...updated, spellSlots });
        closeEditModal();
    }, [characters, updateCharacter, closeEditModal, initSpellSlots]);

    const addHits = useCallback(() => {
        if (!activeCharacter) return;

        numberModal.openModal({
            title: `Прибавить хиты ${activeCharacter.name}`,
            min: 0,
            max: 1000,
            onConfirm: (amount: number) => {
                if (amount <= 0) return;

                const updated = { ...activeCharacter };
                const newCurrent = updated.currentHits + amount;

                if (newCurrent <= updated.hits) {
                    updated.currentHits = newCurrent;
                } else {
                    updated.temporaryHits += newCurrent - updated.hits;
                    updated.currentHits = updated.hits;
                }

                updateCharacter(updated);
            }
        });
    }, [activeCharacter, numberModal, updateCharacter]);

    const subtractHits = useCallback(() => {
        if (!activeCharacter) return;

        numberModal.openModal({
            title: `Снять хиты у ${activeCharacter.name}`,
            min: 0,
            max: 1000,
            onConfirm: (amount: number) => {
                if (amount <= 0) return;

                const updated = { ...activeCharacter };

                let damage = amount;

                const tempDamage = Math.min(updated.temporaryHits, damage);
                updated.temporaryHits -= tempDamage;
                damage -= tempDamage;

                updated.currentHits = Math.max(0, updated.currentHits - damage);

                updateCharacter(updated);
            }
        });
    }, [activeCharacter, numberModal, updateCharacter]);

    const subtractDice = useCallback(() => {
        if (!activeCharacter) return;

        const hitDiceValue =
            classes[activeCharacter.class as ClassKey]?.hitDice;

        if (!hitDiceValue || activeCharacter.diceHitsCount <= 0) return;

        const roll =
            Math.floor(Math.random() * Number(hitDiceValue) + 1);

        const totalHeal =
            roll + getModifier(activeCharacter.characteristics.CON);

        updateCharacter({
            ...activeCharacter,
            diceHitsCount: activeCharacter.diceHitsCount - 1,
            currentHits: Math.min(
                activeCharacter.hits,
                activeCharacter.currentHits + totalHeal
            )
        });
    }, [activeCharacter, updateCharacter]);

    const longRest = useCallback(() => {
        if (!activeCharacter) return;

        updateCharacter({
            ...activeCharacter,
            currentHits: activeCharacter.hits,
            temporaryHits: 0,
            diceHitsCount: Math.min(
                activeCharacter.level,
                activeCharacter.diceHitsCount +
                Math.max(
                    1,
                    Math.floor(
                        (activeCharacter.level -
                            activeCharacter.diceHitsCount) / 2
                    )
                )
            ),
            spellSlots: Object.fromEntries(
                Object.entries(activeCharacter.spellSlots ?? {}).map(
                    ([lvl, slots]) => [
                        Number(lvl),
                        slots.map(() => false)
                    ]
                )
            )
        });
    }, [activeCharacter, updateCharacter]);

    const addNote = useCallback(() => {
        if (!activeCharacter) return;

        const nextNote = createCharacterNote('');
        const updatedNotes = [...normalizeCharacterNotes(activeCharacter.note), nextNote];

        updateCharacter({
            ...activeCharacter,
            note: updatedNotes
        });

        setActiveNoteId(nextNote.id);
    }, [activeCharacter, updateCharacter]);

    const requestDeleteNote = useCallback((id: string) => {
        setDeleteNoteId(id);
    }, []);

    const reorderNotes = useCallback((fromId: string, toId: string) => {
        if (!activeCharacter) return;

        const updatedNotes = reorderCharacterNotes(
            normalizeCharacterNotes(activeCharacter.note),
            fromId,
            toId
        );

        updateCharacter({
            ...activeCharacter,
            note: updatedNotes
        });
        setActiveNoteId(fromId);
    }, [activeCharacter, updateCharacter]);

    const confirmDeleteNote = useCallback(() => {
        if (deleteNoteId === null || !activeCharacter) return;

        const updatedNotes = normalizeCharacterNotes(activeCharacter.note)
            .filter(note => note.id !== deleteNoteId);

        updateCharacter({
            ...activeCharacter,
            note: updatedNotes
        });

        setActiveNoteId(currentId => {
            if (updatedNotes.length === 0) {
                return null;
            }

            if (currentId && updatedNotes.some(note => note.id === currentId)) {
                return currentId;
            }

            return updatedNotes[0].id;
        });
        setDeleteNoteId(null);
    }, [deleteNoteId, activeCharacter, updateCharacter]);

    const handleRemoveCharacter = useCallback((id: string) => {
        removeCharacter(id);
        closeDeleteModal();
    }, [removeCharacter, closeDeleteModal]);

    const actions = useMemo(() => ({
        handleAddCharacter,
        saveCharacter,
        addHits,
        subtractHits,
        subtractDice,
        longRest,
        addNote,
        requestDeleteNote,
        reorderNotes,
        handleRemoveCharacter
    }), [
        handleAddCharacter,
        saveCharacter,
        addHits,
        subtractHits,
        subtractDice,
        longRest,
        addNote,
        requestDeleteNote,
        reorderNotes,
        handleRemoveCharacter
    ]);

    const notes = useMemo(() => ({
        isNoteOpen,
        setIsNoteOpen,
        activeNoteId: resolvedActiveNoteId,
        setActiveNoteId,
        deleteNoteId,
        setDeleteNoteId,
        normalizedNotes,
        confirmDeleteNote
    }), [
        isNoteOpen,
        resolvedActiveNoteId,
        deleteNoteId,
        normalizedNotes,
        confirmDeleteNote
    ]);

    const modals = useMemo(() => ({
        numberModal,
        editingCharacter,
        deletingCharacter,
        creatingCharacter,
        setEditingCharacter,
        setDeletingCharacter,
        setCreatingCharacter,
        closeEditModal,
        closeDeleteModal
    }), [
        numberModal,
        editingCharacter,
        deletingCharacter,
        creatingCharacter,
        closeEditModal,
        closeDeleteModal
    ]);

    return {
        characters,
        addCharacter,
        activeCharacter,
        activeCharacterId,
        setActiveCharacterId,
        actions,
        notes,
        modals
    };
}
