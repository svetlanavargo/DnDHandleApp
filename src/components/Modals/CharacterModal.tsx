import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { CharacterContext } from "../../context/CharacterContext";
import type { Character } from "../../types/Character";
import type { Classes, ClassKey, RaceKey, Characteristics, SpellSlotsState } from "../../types/dnd";
import classesData from "../../data/classes.json";
import rawSpellSlotProgression from "../../data/Spells/spellSlotProgression.json";

import Btn from "../UI/Btn/Btn";
import Input from "../UI/Input/Input";
import Select from "../UI/Select/Select";
import CheckboxDropdown from "../UI/CheckboxDropdown/CheckboxDropdown";

import { TextClasses } from "../../constants/TextClasses";
import { TextSubClasses } from "../../constants/TextSubClasses";
import { TextRace } from "../../constants/TextRaces";
import { TextLanguages } from "../../constants/TextLanguages";
import { TextWeapons } from "../../constants/TextWeapons";
import { TextArmors } from "../../constants/TextArmors";
import { TextTools } from "../../constants/TextTools";
import { skillsListSorted } from "../../constants/TextSkills";

// import { getCharacterPatch } from "../../utils/getCharacterPatch";

import styles from "./Modals.module.css";

// ===== Константы =====
const classes: Classes = classesData as unknown as Classes;
const spellSlotProgression = rawSpellSlotProgression as unknown as Record<string, Record<number, number[]>>;

// ===== Типы формы =====
interface Props {
    character: Character | null;
    onClose: () => void;
    onSave: (updated: Character) => void;
}

type FormValues = {
    name: string;
    race: RaceKey;
    class: ClassKey;
    subclass?: string;
    speed: string;
    ac: string;
    hits: string;
    level: string;
    initiative: string;
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
    hits: "1",
    level: "1",
    initiative: "0",
    characteristics: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    skills: [],
    languages: [],
    weapons: [],
    armors: [],
    tools: [],
};

// ===== Компонент =====
function CharacterModal({ character, onClose }: Props) {
    const { addCharacter, updateCharacter } = useContext(CharacterContext);
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // ===== Инициализация формы =====
    useEffect(() => {
        if (character) {
            queueMicrotask(() => {
                setFormValues({
                    name: character.name,
                    race: character.race,
                    class: character.class,
                    subclass: character.subclass,
                    speed: character.speed.toString(),
                    ac: character.ac.toString(),
                    hits: character.hits.toString(),
                    level: character.level.toString(),
                    initiative: character.initiative.toString(),
                    characteristics: {...character.characteristics},
                    skills: [...character.skills],
                    languages: [...character.languages],
                    weapons: [...character.weapons],
                    armors: [...character.armors],
                    tools: [...character.tools],
                });
            })
        } else {
            queueMicrotask(() => {
                setFormValues(defaultForm);
            })
        }
        firstInputRef.current?.focus();
    }, [character]);

    // ===== Инициализация spellSlots =====
    function initSpellSlots(className: ClassKey, subclassName: string | undefined, level: number): SpellSlotsState {
        const classData = classes[className];
        if (!classData) return {};

        let caster = classData.caster;
        if (subclassName && classData.subclasses?.[subclassName]?.caster) {
            caster = classData.subclasses[subclassName].caster;
        }
        if (!caster) return {};

        const progressionType = caster.progression ?? "full";
        const progression = spellSlotProgression[progressionType] ?? {};
        const slotsPerLevel = progression[level] ?? [];

        const state: SpellSlotsState = {};
        slotsPerLevel.forEach((count, i) => (state[i + 1] = Array(count).fill(false)));
        return state;
    }

    // ===== Изменение полей =====
    function handleChange<K extends keyof FormValues>(field: K, value: FormValues[K]) {
        setFormValues(prev => ({ ...prev, [field]: value }));
    }

    function handleCharacteristicChange(key: keyof Characteristics, value: number) {
        setFormValues(prev => ({
            ...prev,
            characteristics: { ...prev.characteristics, [key]: value },
        }));
    }

    // ===== Сохранение персонажа =====
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const levelNum = Number(formValues.level) || 1;
        const hitsNum = Number(formValues.hits) || 1;

        // Если имя пустое — ставим "Персонаж"
        const nameToUse = formValues.name.trim() || "Персонаж";

        // Определяем spellSlots
        const newSpellSlots =
            character && (character.class !== formValues.class || character.subclass !== formValues.subclass || character.level !== levelNum)
                ? initSpellSlots(formValues.class, formValues.subclass, levelNum)
                : character?.spellSlots ?? initSpellSlots(formValues.class, formValues.subclass, levelNum);

        // Создаём общий объект персонажа
        const charToSave: Character = {
            id: character?.id ?? crypto.randomUUID(),
            name: nameToUse,
            race: formValues.race,
            class: formValues.class,
            subclass: formValues.subclass,
            speed: Number(formValues.speed),
            ac: Number(formValues.ac),
            hits: hitsNum,
            currentHits: character?.currentHits ?? hitsNum,
            temporaryHits: character?.temporaryHits ?? 0,
            level: levelNum,
            initiative: Number(formValues.initiative),
            characteristics: { ...formValues.characteristics },
            skills: [...formValues.skills],
            languages: [...formValues.languages],
            weapons: [...formValues.weapons],
            armors: [...formValues.armors],
            tools: [...formValues.tools],
            spellSlots: newSpellSlots,
            diceHitsCount: character?.diceHitsCount ?? levelNum,
            inventory: character?.inventory ?? {
                note: "",
                currency: { platinum: 0, gold: 0, silver: 0, bronze: 0 },
            },
        };

        if (character) {
            updateCharacter(charToSave);
        } else {
            addCharacter(charToSave);
        }

        onClose();
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
            <h2>{character ? "Редактирование персонажа" : "Создать персонажа"}</h2>

            <Input ref={firstInputRef} type="text" value={formValues.name} onChange={e => handleChange("name", e.target.value)}>Имя</Input>

            <Select label="Раса" value={formValues.race} options={TextRace} onChange={v => v && handleChange("race", v as RaceKey)} />

            <Select label="Класс" value={formValues.class} options={TextClasses} onChange={v => setFormValues(p => ({ ...p, class: v as ClassKey, subclass: undefined }))} />

            <Select label="Сабкласс" value={formValues.subclass} options={TextSubClasses[formValues.class] ?? {}} placeholder="— Нет —" onChange={v => handleChange("subclass", v)} />

            {["level","hits","speed","ac","initiative"].map(field => (
                <Input key={field} type="text" inputMode="numeric" value={formValues[field as keyof FormValues] as string} onChange={e => handleChange(field as keyof FormValues, e.target.value.replace(/\D/g, "") as any)}>
                    {field === "level" ? "Уровень" : field === "hits" ? "Хиты" : field === "speed" ? "Скорость" : field === "ac" ? "AC" : "Инициатива"}
                </Input>
            ))}

            <h3>Характеристики</h3>
            <div className={styles.flex}>
                {Object.entries(formValues.characteristics).map(([key,value]) => (
                    <Input key={key} type="text" inputMode="numeric" value={value.toString()} onChange={e => handleCharacteristicChange(key as keyof Characteristics, Number(e.target.value) || 0)}>
                        {key}
                    </Input>
                ))}
            </div>

            <h3>Владения</h3>
            <CheckboxDropdown label="Навыки" options={skillsListSorted.map(s => ({ value: s.key, label: `${s.name} (${s.ability})` }))} selected={formValues.skills} onChange={v => handleChange("skills", v)} />
            <CheckboxDropdown label="Языки" options={Object.entries(TextLanguages).map(([k,v]) => ({ value:k,label:v }))} selected={formValues.languages} onChange={v => handleChange("languages", v)} />
            <CheckboxDropdown label="Оружие" options={Object.entries(TextWeapons).map(([k,v]) => ({ value:k,label:v }))} selected={formValues.weapons} onChange={v => handleChange("weapons", v)} />
            <CheckboxDropdown label="Броня" options={Object.entries(TextArmors).map(([k,v]) => ({ value:k,label:v }))} selected={formValues.armors} onChange={v => handleChange("armors", v)} />
            <CheckboxDropdown label="Инструменты" options={Object.entries(TextTools).map(([k,v]) => ({ value:k,label:v }))} selected={formValues.tools} onChange={v => handleChange("tools", v)} />

            <div className={styles.modalButtons}>
                <Btn type="submit">{character ? "Сохранить" : "Создать"}</Btn>
                <Btn onClick={onClose}>Отмена</Btn>
            </div>
        </form>
    );
}

export default CharacterModal;