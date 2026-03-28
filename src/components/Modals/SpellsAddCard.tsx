import { useMemo, useState, useEffect } from 'react';
import Btn from '../UI/Btn/Btn.tsx';
import Input from '../UI/Input/Input.tsx';
import Select from '../UI/Select/Select.tsx';
import CardSlider from '../SpellsList/CardSlider/CardSlider.tsx';
import SpellCard from '../SpellsList/SpellCard/SpellCard.tsx';
import styles from './Modals.module.css';

import type { Character } from '../../types/Character';
import type { ClassKey, SpellLevel, Spell } from '../../types/dnd';
import { TextSubClasses } from '../../constants/TextSubClasses';
import { classesData } from '../../constants/classesData';

import spellsJson from '../../data/Spells/spells.json';

interface SpellsSettingsProps {
    character?: Character;
    handleModalToggle: () => void;
    updateCharacter: (updated: Character) => void;
}

type SpellLevelFilter = SpellLevel | "all";

type Filters = {
    class: ClassKey | "";
    subclass: string;
    level: SpellLevelFilter;
    search: string;
};

// ================= DnD LOGIC =================

function getMaxSpellLevel(level: number, classKey?: ClassKey): SpellLevel {
    if (!classKey) return "0";

    const FULL = ["wizard", "sorcerer", "cleric", "druid", "bard"];
    const HALF = ["paladin", "ranger"];

    if (FULL.includes(classKey)) {
        if (level >= 17) return "9";
        if (level >= 15) return "8";
        if (level >= 13) return "7";
        if (level >= 11) return "6";
        if (level >= 9) return "5";
        if (level >= 7) return "4";
        if (level >= 5) return "3";
        if (level >= 3) return "2";
        return "1";
    }

    if (HALF.includes(classKey)) {
        if (level >= 17) return "5";
        if (level >= 13) return "4";
        if (level >= 9) return "3";
        if (level >= 5) return "2";
        if (level >= 2) return "1";
        return "0";
    }

    if (classKey === "warlock") {
        if (level >= 17) return "5";
        if (level >= 7) return "4";
        if (level >= 5) return "3";
        if (level >= 3) return "2";
        return "1";
    }

    return "0";
}

// ================= COMPONENT =================

function SpellsAddCard({
                           character,
                           handleModalToggle,
                           updateCharacter
                       }: SpellsSettingsProps) {

    const [randomSpellName, setRandomSpellName] = useState("");
    const [activeSpell, setActiveSpell] = useState<Spell | null>(null);

    const initialFilters: Filters = useMemo(() => {
        if (!character) {
            return { class: "", subclass: "", level: "all", search: "" };
        }

        return {
            class: character.class ?? "",
            subclass: character.subclass ?? "",
            level: "all",
            search: ""
        };
    }, [character]);

    const [filters, setFilters] = useState<Filters>(initialFilters);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

    function handleFilterChange<K extends keyof Filters>(
        key: K,
        value: Filters[K]
    ) {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }

    const levelOptions: Record<string, string> = {
        all: "Доступные",
        "0": "Заговоры",
        "1": "1 уровень",
        "2": "2 уровень",
        "3": "3 уровень",
        "4": "4 уровень",
        "5": "5 уровень",
        "6": "6 уровень",
        "7": "7 уровень",
        "8": "8 уровень",
        "9": "9 уровень",
    };

    const classOptions = useMemo(() => {
        return Object.fromEntries(
            Object.entries(classesData).map(([k, c]) => [k, c.name])
        );
    }, []);

    const subclassOptions = useMemo(() => {
        if (!filters.class) return {};
        return TextSubClasses?.[filters.class] ?? {};
    }, [filters.class]);

    // ================= FILTER =================

    const availableSpells = useMemo(() => {
        if (!character) return spellsJson as Spell[];

        const activeClass = (filters.class || character.class) as ClassKey;

        const maxLevel = Number(
            getMaxSpellLevel(character.level, activeClass)
        );

        return (spellsJson as Spell[]).filter((spell) => {
            const spellLevel = Number(spell.lvl);

            const classMatch =
                !filters.class ||
                Object.keys(spell.classes || {}).length === 0 ||
                Object.keys(spell.classes).includes(filters.class);

            const subclassMatch =
                !filters.subclass ||
                Object.keys(spell.subclass || {}).length === 0 ||
                Object.keys(spell.subclass).includes(filters.subclass);

            const levelMatch =
                filters.level === "all"
                    ? spellLevel <= maxLevel
                    : spell.lvl === filters.level;

            const search = filters.search.toLowerCase();

            const searchMatch =
                !search ||
                spell.nameRu.toLowerCase().includes(search) ||
                spell.nameEn.toLowerCase().includes(search);

            return classMatch && subclassMatch && levelMatch && searchMatch;
        });
    }, [character, filters]);

    function getRandomSpellName(spells: Spell[]) {
        if (!spells.length) return "";
        return spells[Math.floor(Math.random() * spells.length)].nameRu;
    }

    useEffect(() => {
        setRandomSpellName(getRandomSpellName(availableSpells));
    }, [availableSpells]);

    function handleToggleSpell() {
        if (!character || !activeSpell) return;

        const levelKey = activeSpell.lvl as SpellLevel;
        const currentSpells = character.spells?.[levelKey] || [];

        const isAdded = currentSpells.includes(activeSpell.url);

        const updatedLevelSpells = isAdded
            ? currentSpells.filter((s) => s !== activeSpell.url)
            : [...currentSpells, activeSpell.url];

        updateCharacter({
            ...character,
            spells: {
                ...character.spells,
                [levelKey]: updatedLevelSpells
            }
        });
    }

    const isActiveSpellAdded = useMemo(() => {
        if (!character || !activeSpell) return false;

        const levelKey = activeSpell.lvl as SpellLevel;

        return character.spells?.[levelKey]?.includes(activeSpell.url);
    }, [character, activeSpell]);

    return (
        <div className={styles.modalWrapperFlex}>
            <div className={styles.flex}>
                <h3>Добавление заклинаний</h3>
                <Btn onClick={handleModalToggle} classBtn='close'/>
            </div>

            <Select
                label="Класс"
                value={filters.class || undefined}
                options={classOptions}
                onChange={(v) => handleFilterChange("class", v as ClassKey)}
            />

            <Select
                label="Подкласс"
                value={filters.subclass || undefined}
                options={subclassOptions}
                onChange={(v) => handleFilterChange("subclass", v ?? "")}
            />

            <Select
                label="Уровень"
                value={filters.level.toString()}
                options={levelOptions}
                onChange={(v) =>
                    handleFilterChange(
                        "level",
                        v === "all" ? "all" : (v as SpellLevel)
                    )
                }
            />

            <Input
                type="text"
                placeholder={`Например: ${randomSpellName}`}
                value={filters.search}
                onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                }
            />

            <div className={styles.spellsList}>
                <h3>Доступные заклинания:</h3>

                {availableSpells.length === 0 ? (
                    <p>Нет доступных заклинаний</p>
                ) : (
                    <>
                        <CardSlider
                            items={availableSpells}
                            getKey={(spell) => spell.url}
                            onActiveChange={setActiveSpell}
                            renderItem={(spell) => {
                                const isAdded =
                                    character?.spells?.[spell.lvl]?.includes(spell.url);

                                return (
                                    <SpellCard
                                        spell={spell}
                                        fill={character?.fill || "sorcerer"}
                                        size="small"
                                        isAdded={isAdded}
                                    />
                                );
                            }}
                        />

                        <div className={styles.actions}>
                            <Btn
                                onClick={handleToggleSpell}
                                classBtn={isActiveSpellAdded ? "btnRed" : "btnColor"}
                            >
                                {isActiveSpellAdded ? "Удалить заклинание" : "Добавить заклинание"}
                            </Btn>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.modalButtons}>
                <Btn onClick={handleModalToggle}>
                    Закрыть
                </Btn>
            </div>
        </div>
    );
}

export default SpellsAddCard;