import { useState, useEffect } from 'react';
import type { Character } from '../../types/Character.ts';
import type { SpellSlotsState } from '../../types/Character.ts';
import spellSlotProgression from "../../data/Spells/spellSlotProgression.json";
import { classes } from '../../data/Classes/classes.json';
import { getModifier } from '../../utils/getModifier.ts';
import Tabs from './Tabs/Tabs.tsx';
import List from './List/List.tsx';
import CharacterModal from '../Modals/CharacterModal.tsx';
import styles from './CharacterList.module.css';

const LOCAL_STORAGE_KEY = 'characters';

function CharacterList() {
    const [characters, setCharacters] = useState<Character[]>(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored) as Character[];
            } catch {
                return [];
            }
        }
        return [];
    });

    const [activeId, setActiveId] = useState(
        () => characters.length > 0 ? characters[0].id : null
    );

    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [isNoteOpen, setIsNoteOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
    }, [characters]);


    const activeCharacter = characters.find(c => c.id === activeId) ?? characters[0] ?? null;

    const addCharacter = () => {
        if (characters.length >= 6) return;

        const newChar: Character = {
            id: Math.random().toString(36).slice(2, 11),
            race: 'human',
            speed: 30,
            ac: 10,
            name: '',
            hits: 1,
            diceHitsCount: 1,
            currentHits: 1,
            temporaryHits: 0,
            level: 1,
            initiative: 0,
            class: 'fighter',
            subclass: undefined,
            characteristics: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
            skills: [],
            languages: [],
            weapons: [],
            armors: [],
            tools: [],
            spellSlots: initSpellSlots('fighter', 1)
        };

        setEditingCharacter(newChar);
    };

    const saveCharacter = (updated: Character) => {
        setCharacters(prev => {
            const exists = prev.find(c => c.id === updated.id);

            let spellSlots = updated.spellSlots;

            if (
                !exists ||
                exists.class !== updated.class ||
                exists.subclass !== updated.subclass ||
                exists.level !== updated.level
            ) {
                spellSlots = initSpellSlots(updated.class, updated.subclass, updated.level);
            }

            const updatedCharacter = { ...updated, spellSlots };

            if (exists) {
                return prev.map(c => (c.id === updated.id ? updatedCharacter : c));
            }

            return [...prev, updatedCharacter];
        });

        setActiveId(updated.id);
        setEditingCharacter(null);
    };

    function initSpellSlots(
        className: string,
        subclassName: string | undefined,
        level: number
    ): SpellSlotsState {
        const classData = classes[className.toLowerCase()];
        if (!classData) return {};

        let caster = classData.caster;

        if ((!caster || subclassName) && classData.subclasses?.[subclassName]?.caster) {
            caster = classData.subclasses[subclassName].caster;
        }

        if (!caster) return {};

        const progressionType = caster.progression || 'full';
        const progression = spellSlotProgression[progressionType] || {};
        const slotsPerLevel = progression[level] || [];

        const state: SpellSlotsState = {};
        slotsPerLevel.forEach((count, i) => {
            state[i + 1] = Array(count).fill(false);
        });

        return state;
    }

    const handleToggleSkill = (skill: string) => {
        setCharacters(prev =>
            prev.map(c => {
                if (c.id !== activeId) return c;
                const hasSkill = c.skills.includes(skill);
                return {
                    ...c,
                    skills: hasSkill
                        ? c.skills.filter(s => s !== skill)
                        : [...c.skills, skill]
                };
            })
        );
    };

    const removeCharacter = (id: number | string) => {
        setCharacters(prev => {
            const updated = prev.filter(c => c.id !== id);
            if (activeId === id) {
                setActiveId(updated[0]?.id ?? null);
            }
            return updated;
        });
    };

    const setActive = (id: number | string) => setActiveId(id);
    const closeModal = () => setEditingCharacter(null);

    const addHits = () => {
        const value = prompt('Сколько хитов прибавить?');
        if (!value) return;

        const amount = Number(value);
        if (isNaN(amount) || amount <= 0) return;

        setCharacters(prev =>
            prev.map(c => {
                if (c.id !== activeId) return c;

                const newCurrent = c.currentHits + amount;
                if (newCurrent <= c.hits) return { ...c, currentHits: newCurrent };

                const overflow = newCurrent - c.hits;
                return { ...c, currentHits: c.hits, temporaryHits: c.temporaryHits + overflow };
            })
        );
    };

    const subtractHits = () => {
        const value = prompt('Сколько хитов снять?');
        if (!value) return;

        const amount = Number(value);
        if (isNaN(amount) || amount <= 0) return;

        setCharacters(prev =>
            prev.map(c => {
                if (c.id !== activeId) return c;

                let damage = amount;
                let newTemp = c.temporaryHits;
                let newCurrent = c.currentHits;

                if (newTemp > 0) {
                    const tempDamage = Math.min(newTemp, damage);
                    newTemp -= tempDamage;
                    damage -= tempDamage;
                }

                if (damage > 0) newCurrent = Math.max(0, newCurrent - damage);

                return { ...c, temporaryHits: newTemp, currentHits: newCurrent };
            })
        );
    };

    const subtractDice = () => {
        setCharacters(prev =>
            prev.map(c => {
                if (c.id !== activeId) return c;

                const dice = c.diceHitsCount;
                if (dice <= 0) return c;

                const newDice = dice - 1;

                const hitDice = Number(classes[c.class]?.hitDice);
                const roll = Math.floor(Math.random() * hitDice + 1);
                const mod = getModifier(c.characteristics.CON);
                const totalHeal = roll + mod;

                const newCurrentHits = Math.min(c.hits, c.currentHits + totalHeal);

                return {
                    ...c,
                    diceHitsCount: newDice,
                    currentHits: newCurrentHits
                };
            })
        );
    };

    const longRest = () => {
        setCharacters(prev =>
            prev.map(c => {
                if (c.id !== activeId) return c;

                const newCurrentHits = c.hits;
                const newTemporaryHits = 0;

                const maxDice = c.level;
                const usedDice = maxDice - c.diceHitsCount;
                const recoverDice = Math.max(1, Math.floor(usedDice / 2));
                const newDiceHitsCount = Math.min(maxDice, c.diceHitsCount + recoverDice);

                // восстановление всех spell slots
                const newSpellSlots = Object.fromEntries(
                    Object.entries(c.spellSlots).map(([lvl, slots]) => [
                        lvl,
                        slots.map(() => false)
                    ])
                );

                return {
                    ...c,
                    currentHits: newCurrentHits,
                    temporaryHits: newTemporaryHits,
                    diceHitsCount: newDiceHitsCount,
                    spellSlots: newSpellSlots
                };
            })
        );
    };

    return (
        <div className={styles.characterListContainer}>
            <div className={styles.characterList}>
                <Tabs
                    characters={characters}
                    activeId={activeId}
                    setActive={setActive}
                    addCharacter={addCharacter}
                />
                {activeCharacter && (
                    <List
                        onToggleSkill={handleToggleSkill}
                        activeCharacter={activeCharacter}
                        removeCharacter={() => removeCharacter(activeCharacter.id)}
                        openEditModal={() => setEditingCharacter(activeCharacter)}
                        longRest={longRest}
                        addHits={addHits}
                        subtractHits={subtractHits}
                        subtractDice={subtractDice}
                        text={activeCharacter.note || ''}
                        isNoteOpen={isNoteOpen}
                        toggleNoteOpen={() => setIsNoteOpen(prev => !prev)}
                        character={activeCharacter}
                        updateCharacter={saveCharacter}
                    />
                )}
            </div>

            {editingCharacter && (
                <CharacterModal
                    isOpen
                    character={editingCharacter}
                    onClose={closeModal}
                    onSave={saveCharacter}
                />
            )}
        </div>
    );
}

export default CharacterList;