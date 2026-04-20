import React, { useEffect, useRef } from "react";
import type { Character } from "../../types/Character";
import type { RaceKey, Characteristics, ClassKey } from "../../types/dnd";

import Btn from "../UI/Btn/Btn";
import Input from "../UI/Input/Input";
import Select from "../UI/Select/Select";
import CheckboxDropdown from "../UI/CheckboxDropdown/CheckboxDropdown";

import { SubclassesData } from "../../constants/subclassesData.ts";
import { racesData } from "../../constants/racesData";
import { SubracesData } from "../../constants/subracesData.ts";
import { classesData } from "../../constants/classesData";

import { TextLanguages } from "../../constants/TextLanguages";
import { TextWeapons } from "../../constants/TextWeapons";
import { TextArmors } from "../../constants/TextArmors";
import { TextTools } from "../../constants/TextTools";
import { skillsListSorted } from "../../constants/TextSkills";

import { useCharacterForm } from "../../hooks/useCharacterForm";

import styles from "./Modals.module.css";

const THIEVES_TOOLS_KEY = 'thievesTools';

interface Props {
    character: Character | null;
    onClose: () => void;
    onSave: (character: Character) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

type NumericField = "hits" | "speed" | "ac" | "initiative";

function CharacterModal({ character, onClose, onSave, onDelete, disabled }: Props) {
    const {
        formValues,
        handleChange,
        handleCharacteristicChange,
        handleExpertiseChange,
        buildCharacter
    } = useCharacterForm(character);

    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    const expertiseLimit = Number(formValues.level) >= 6 ? 4 : 2;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (disabled) return;

        const charToSave = buildCharacter(character);

        onSave(charToSave);
        onClose();
    }

    const fieldsConfig = {
        hits: { label: "Хиты", max: 1000 },
        speed: { label: "Скорость", max: 200 },
        ac: { label: "Класс Брони", max: 40 },
        initiative: { label: "Инициатива", max: 30 },
    };

    const fieldKeys = Object.keys(fieldsConfig) as NumericField[];

    function clampNumber(value: string, max: number): string {
        const digits = value.replace(/\D/g, "");
        if (!digits) return "";
        return Math.min(Number(digits), max).toString();
    }

    const subraceOptions = SubracesData[formValues.race] ?? null;

    return (
        <form className={styles.form} onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
            <div className={styles.flex}>
                <h2>{character ? "Редактирование" : "Создание"}</h2>
                <Btn onClick={onClose} classBtn='close' disabled={disabled}/>
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
                options={Object.fromEntries(
                    Object.entries(racesData).map(([key, race]) => [key, race.name])
                )}
                onChange={v => v && handleChange("race", v as RaceKey)}
            />

            {subraceOptions && (
                <Select
                    label="Подраса"
                    value={formValues.subrace}
                    options={subraceOptions}
                    placeholder="— Нет —"
                    onChange={v => handleChange("subrace", v)}
                />
            )}

            <Select
                label="Класс"
                value={formValues.class}
                options={Object.fromEntries(
                    Object.entries(classesData).map(([key, c]) => [key, c.name])
                )}
                onChange={v =>
                    v &&
                    handleChange("class", v as ClassKey) &&
                    handleChange("subclass", undefined)
                }
            />

            <Select
                label="Подкласс"
                value={formValues.subclass}
                options={SubclassesData[formValues.class] ?? {}}
                placeholder="— Нет —"
                onChange={v => handleChange("subclass", v)}
            />

            <Input
                type="text"
                inputMode="numeric"
                value={formValues.level}
                onChange={e => handleChange("level", clampNumber(e.target.value, 20))}
            >
                Уровень
            </Input>

            <div className={styles.inputsGroup}>
                {fieldKeys.map(key => (
                    <Input
                        key={key}
                        type="text"
                        inputMode="numeric"
                        value={formValues[key]}
                        onChange={e =>
                            handleChange(key, clampNumber(e.target.value, fieldsConfig[key].max))
                        }
                    >
                        {fieldsConfig[key].label}
                    </Input>
                ))}
            </div>

            <h3>Характеристики</h3>
            <div className={styles.inputsGroup}>
                {Object.entries(formValues.characteristics).map(([key, value]) => (
                    <Input
                        key={key}
                        type="text"
                        inputMode="numeric"
                        value={value.toString()}
                        onChange={e =>
                            handleCharacteristicChange(
                                key as keyof Characteristics,
                                Number(clampNumber(e.target.value, 30)) || 0
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

            {formValues.class === "rogue" && (
                <>
                    <h3>
                        Компетентность ({formValues.expertise.length}/{expertiseLimit})
                    </h3>

                    <CheckboxDropdown
                        label="Выбери навыки"
                        options={[
                            ...formValues.skills.map(skill => {
                                const skillData = skillsListSorted.find(s => s.key === skill);

                                const isSelected = formValues.expertise.includes(skill);
                                const isDisabled =
                                    formValues.expertise.length >= expertiseLimit && !isSelected;

                                return {
                                    value: skill,
                                    label: skillData
                                        ? `${skillData.name} (${skillData.ability})`
                                        : skill,
                                    disabled: isDisabled,
                                };
                            }),
                            ...(formValues.tools.includes(THIEVES_TOOLS_KEY)
                                ? [{
                                    value: THIEVES_TOOLS_KEY,
                                    label: 'Воровские инструменты',
                                    disabled:
                                        formValues.expertise.length >= expertiseLimit &&
                                        !formValues.expertise.includes(THIEVES_TOOLS_KEY),
                                }]
                                : [])
                        ]}
                        selected={formValues.expertise}
                        onChange={handleExpertiseChange}
                    />
                </>
            )}

            <CheckboxDropdown
                label="Языки"
                options={Object.entries(TextLanguages).map(([k, v]) => ({ value: k, label: v }))}
                selected={formValues.languages}
                onChange={v => handleChange("languages", v)}
            />

            <CheckboxDropdown
                label="Оружие"
                options={Object.entries(TextWeapons).map(([k, v]) => ({ value: k, label: v }))}
                selected={formValues.weapons}
                onChange={v => handleChange("weapons", v)}
            />

            <CheckboxDropdown
                label="Броня"
                options={Object.entries(TextArmors).map(([k, v]) => ({ value: k, label: v }))}
                selected={formValues.armors}
                onChange={v => handleChange("armors", v)}
            />

            <CheckboxDropdown
                label="Инструменты"
                options={Object.entries(TextTools).map(([k, v]) => ({ value: k, label: v }))}
                selected={formValues.tools}
                onChange={v => handleChange("tools", v)}
            />

            {disabled && (
                <p className={styles.formHint}>Восстанавливаем сессию. Сохранение персонажа скоро станет доступно.</p>
            )}

            <div className={styles.modalButtons}>
                {character && onDelete && (
                    <Btn onClick={onDelete} classBtn='btnRed' disabled={disabled}>
                        Удалить
                    </Btn>
                )}
                <Btn type="submit" classBtn='btnColor' disabled={disabled}>
                    {character ? "Сохранить" : "Создать"}
                </Btn>
                <Btn onClick={onClose} disabled={disabled}>Отмена</Btn>
            </div>
        </form>
    );
}

export default CharacterModal;
