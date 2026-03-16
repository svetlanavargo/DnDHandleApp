import { useState, useEffect } from 'react';
import { classes } from '../../data/Classes/classes.json';
import { getModifier } from '../../utils/getModifier.ts';
import Tabs from './Tabs/Tabs.tsx';
import List from './List/List.tsx';
import EditCharacterModal from '../Modals/EditCharacterModal.tsx';
import styles from './CharacterList.module.css';

export interface Characteristics {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
}

export interface Character {
    id: number | string;
    race: string;
    speed: number;
    ac: number;
    name: string;
    hits: number;
    diceHitsCount: number;
    currentHits: number;
    temporaryHits: number;
    initiative: number;
    level: number;
    class: string;
    characteristics: Characteristics;
    skills: string[];
    languages: string[];
    weapons: string[];
    armors: string[];
    tools: string[]
    note?: string;
}

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

    // Берём первый персонаж как активный, если есть
    const [activeId, setActiveId] = useState<number | string | null>(() => {
        if (characters.length > 0) return characters[0].id;
        return null;
    });

    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [isNoteOpen, setIsNoteOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
        // Если активного персонажа нет, ставим первого
        if (!activeId && characters.length > 0) {
            setActiveId(characters[0].id);
        }
    }, [characters, activeId]);

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
            characteristics: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
            skills: [],
            languages: [],
            weapons: [],
            armors: [],
            tools: []
        };

        setEditingCharacter(newChar);
    };

    const saveCharacter = (updated: Character) => {
        setCharacters(prev => {
            const exists = prev.some(c => c.id === updated.id);
            if (exists) {
                return prev.map(c => (c.id === updated.id ? updated : c));
            }
            return [...prev, updated];
        });

        setActiveId(updated.id);
        setEditingCharacter(null);
    };

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
                const newDice = Math.max(0, dice - 1);

                if (newDice === 0) return { ...c, diceHitsCount: newDice };

                const hitDice = Number(classes[c.class]?.hitDice);
                const roll = Math.floor(Math.random() * hitDice + 1);
                const mod = getModifier(c.characteristics.CON);
                const totalHeal = roll + mod;

                const newCurrentHits = Math.min(c.hits, c.currentHits + totalHeal);

                return { ...c, diceHitsCount: newDice, currentHits: newCurrentHits };
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

                return {
                    ...c,
                    currentHits: newCurrentHits,
                    temporaryHits: newTemporaryHits,
                    diceHitsCount: newDiceHitsCount
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
                <EditCharacterModal
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