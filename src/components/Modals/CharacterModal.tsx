import { useState, useEffect, useRef } from "react";
import type { Character, Characteristics } from "../../types/Character";
import { TextClasses } from "../../constants/TextClasses";
import { TextSubClasses } from "../../constants/TextSubClasses";
import { TextRace } from "../../constants/TextRaces";
import { TextLanguages } from "../../constants/TextLanguages";
import { TextWeapons } from "../../constants/TextWeapons";
import { TextArmors } from "../../constants/TextArmors";
import { TextTools } from "../../constants/TextTools";
import { skillsListSorted } from "../../constants/TextSkills";
import { getCharacterPatch } from "../../utils/getCharacterPatch";

import Btn from "../UI/Btn/Btn";
import Input from "../UI/Input/Input";
import Select from "../UI/Select/Select";
import CheckboxDropdown from "../UI/CheckboxDropdown/CheckboxDropdown";

import { classes } from "../../data/Classes/classes.json";
import spellSlotProgression from "../../data/Spells/spellSlotProgression.json";

import styles from "./Modals.module.css";

interface Props {
    isOpen: boolean;
    character: Character;
    onClose: () => void;
    onSave: (updated: Character) => void;
}

type FormValues = {
    name: string;
    race: string;
    class: string;
    subclass?: string;
    speed: string;
    ac: string;
    hits: string;
    initiative: string;
    level: string;
    characteristics: Characteristics;
    skills: string[];
    languages: string[];
    weapons: string[];
    armors: string[];
    tools: string[];
};

const defaultForm: FormValues = {
    name: "",
    race: "human",
    class: "fighter",
    subclass: undefined,
    speed: "30",
    ac: "10",
    hits: "",
    initiative: "0",
    level: "1",
    characteristics: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    skills: [],
    languages: [],
    weapons: [],
    armors: [],
    tools: []
};

function CharacterModal({ isOpen, character, onClose, onSave }: Props) {
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        setFormValues({
            name: character.name,
            race: character.race,
            class: character.class,
            subclass: character.subclass,
            speed: character.speed.toString(),
            ac: character.ac.toString(),
            hits: character.hits.toString(),
            initiative: character.initiative.toString(),
            level: character.level.toString(),
            characteristics: { ...character.characteristics },
            skills: [...character.skills],
            languages: [...character.languages],
            weapons: [...character.weapons],
            armors: [...character.armors],
            tools: [...character.tools]
        });

        setTimeout(() => firstInputRef.current?.focus(), 0);
    }, [isOpen, character]);

    function handleChange<K extends keyof FormValues>(field: K, value: FormValues[K]) {
        setFormValues(prev => ({ ...prev, [field]: value }));
    }

    function handleCharacteristicChange(key: keyof Characteristics, value: number) {
        setFormValues(prev => ({
            ...prev,
            characteristics: { ...prev.characteristics, [key]: value }
        }));
    }

    function initSpellSlots(className: string, subclassName: string | undefined, level: number) {
        const classData = classes[className];
        if (!classData) return {};

        let caster = classData.caster;

        if (subclassName && classData.subclasses?.[subclassName]?.caster) {
            caster = classData.subclasses[subclassName].caster;
        }

        if (!caster) return {};

        const progression = spellSlotProgression[caster.progression ?? "full"];
        const slotsPerLevel = progression[level] ?? [];

        const state: Record<number, boolean[]> = {};

        slotsPerLevel.forEach((count, i) => {
            state[i + 1] = Array(count).fill(false);
        });

        return state;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const level = Number(formValues.level) || 1;
        const hits = Number(formValues.hits) || 0;

        let spellSlots = character.spellSlots;

        if (
            character.class !== formValues.class ||
            character.subclass !== formValues.subclass ||
            character.level !== level
        ) {
            spellSlots = initSpellSlots(formValues.class, formValues.subclass, level);
        }

        const updated: Character = {
            ...character,
            name: formValues.name,
            race: formValues.race,
            class: formValues.class,
            subclass: formValues.subclass,
            speed: Number(formValues.speed) || 0,
            ac: Number(formValues.ac) || 0,
            hits,
            level,
            initiative: Number(formValues.initiative) || 0,
            characteristics: { ...formValues.characteristics },
            skills: [...formValues.skills],
            languages: [...formValues.languages],
            weapons: [...formValues.weapons],
            armors: [...formValues.armors],
            tools: [...formValues.tools],
            spellSlots
        };

        const patch = getCharacterPatch(character, updated);

        onSave({
            ...character,
            ...patch
        });
    }

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <form
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className={styles.flex}>
                    <h2>{character.name ? "Редактирование" : "Создать персонажа"}</h2>
                    <Btn onClick={onClose} classBtn="close" />
                </div>

                <Input
                    ref={firstInputRef}
                    type="text"
                    value={formValues.name}
                    onChange={e => handleChange("name", e.target.value)}
                >
                    Имя
                </Input>

                <Select
                    label="Раса"
                    value={formValues.race}
                    options={TextRace}
                    onChange={v => handleChange("race", v)}
                />

                <Select
                    label="Класс"
                    value={formValues.class}
                    options={TextClasses}
                    onChange={v => setFormValues(p => ({ ...p, class: v, subclass: undefined }))}
                />

                <Select
                    label="Сабкласс"
                    value={formValues.subclass}
                    options={TextSubClasses[formValues.class] ?? {}}
                    placeholder="— Нет —"
                    onChange={v => handleChange("subclass", v)}
                />

                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.level}
                    onChange={e => handleChange("level", e.target.value.replace(/\D/g, ""))}
                >
                    Уровень
                </Input>

                <h3>Характеристики</h3>

                <div className={styles.flex}>
                    {Object.entries(formValues.characteristics).map(([key, value]) => (
                        <Input
                            key={key}
                            type="text"
                            inputMode="numeric"
                            value={value.toString()}
                            onChange={e =>
                                handleCharacteristicChange(
                                    key as keyof Characteristics,
                                    Number(e.target.value) || 0
                                )
                            }
                        >
                            {key}
                        </Input>
                    ))}
                </div>

                <h3>Владения</h3>

                <CheckboxDropdown
                    label="Навыки"
                    options={skillsListSorted.map(s => ({
                        value: s.key,
                        label: `${s.name} (${s.ability})`
                    }))}
                    selected={formValues.skills}
                    onChange={v => handleChange("skills", v)}
                />

                <CheckboxDropdown
                    label="Языки"
                    options={Object.entries(TextLanguages).map(([k, v]) => ({
                        value: k,
                        label: v
                    }))}
                    selected={formValues.languages}
                    onChange={v => handleChange("languages", v)}
                />

                <CheckboxDropdown
                    label="Оружие"
                    options={Object.entries(TextWeapons).map(([k, v]) => ({
                        value: k,
                        label: v
                    }))}
                    selected={formValues.weapons}
                    onChange={v => handleChange("weapons", v)}
                />

                <CheckboxDropdown
                    label="Броня"
                    options={Object.entries(TextArmors).map(([k, v]) => ({
                        value: k,
                        label: v
                    }))}
                    selected={formValues.armors}
                    onChange={v => handleChange("armors", v)}
                />

                <CheckboxDropdown
                    label="Инструменты"
                    options={Object.entries(TextTools).map(([k, v]) => ({
                        value: k,
                        label: v
                    }))}
                    selected={formValues.tools}
                    onChange={v => handleChange("tools", v)}
                />

                <div className={styles.modalButtons}>
                    <Btn type="submit">Сохранить</Btn>
                    <Btn onClick={onClose}>Отмена</Btn>
                </div>
            </form>
        </div>
    );
}

export default CharacterModal;