import React, { useState, useEffect, useRef } from 'react';
import { textSpec } from '../../constants/classes.ts';
import { textRace } from '../../constants/races.ts';
import { textLanguages } from '../../constants/languages.ts';
import { weapons } from '../../constants/weapons.ts';
import { armors } from '../../constants/armors.ts';
import { tools } from '../../constants/tools.ts';
import type { Character, Characteristics } from '../CharacterList/CharacterList.tsx';
import Btn from '../UI/Btn/Btn.tsx';
import Input from '../UI/Input/Input.tsx';
import styles from './Modals.module.css';

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
    tools: string[]
};

const defaultForm: FormValues = {
    name: '',
    race: 'human',
    class: 'fighter',
    speed: '30',
    ac: '10',
    hits: '',
    initiative: '0',
    level: '1',
    characteristics: { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
    skills: [],
    languages: [],
    weapons: [],
    armors: [],
    tools: []
};

function EditCharacterModal({ isOpen, character, onClose, onSave }: Props) {
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);
    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        setFormValues({
            name: character.name,
            race: character.race,
            class: character.class,
            speed: character.speed.toString(),
            ac: character.ac.toString(),
            hits: character.hits.toString(),
            initiative: character.initiative.toString(),
            level: character.level.toString(),
            characteristics: { ...character.characteristics },
            skills: [...character.skills],
            languages: [...character.languages],
            weapons: character.weapons || [],
            armors: character.armors || [],
            tools: character.tools || []
        });

        const id = setTimeout(() => firstInputRef.current?.focus(), 0);
        return () => clearTimeout(id);
    }, [isOpen, character]);

    const handleChange = (field: keyof FormValues, value: string) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const handleCharacteristicChange = (key: keyof Characteristics, value: number) => {
        setFormValues(prev => ({
            ...prev,
            characteristics: { ...prev.characteristics, [key]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const level = formValues.level === '' ? 1 : Number(formValues.level);

        const updated: Character = {
            ...character,
            name: formValues.name,
            race: formValues.race,
            class: formValues.class,
            speed: formValues.speed === '' ? 0 : Number(formValues.speed),
            ac: formValues.ac === '' ? 0 : Number(formValues.ac),
            hits: formValues.hits === '' ? 0 : Number(formValues.hits),
            initiative: formValues.initiative === '' ? 0 : Number(formValues.initiative),
            level,
            characteristics: { ...formValues.characteristics },
            skills: [...formValues.skills],
            languages: [...formValues.languages],
            weapons: [...formValues.weapons],
            armors: [...formValues.armors],
            tools: [...formValues.tools],
            diceHitsCount: level
        };

        onSave(updated);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <form
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h2>{character.name ? 'Редактировать персонажа' : 'Создать персонажа'}</h2>

                <Input
                    ref={firstInputRef}
                    type="text"
                    value={formValues.name}
                    onChange={e => handleChange('name', e.target.value)}
                >
                    Имя
                </Input>

                <select
                    value={formValues.race}
                    onChange={e => handleChange('race', e.target.value)}
                >
                    {Object.entries(textRace).map(([eng, rus]) => (
                        <option key={eng} value={eng}>{rus}</option>
                    ))}
                </select>

                <select
                    value={formValues.class}
                    onChange={e => handleChange('class', e.target.value)}
                >
                    {Object.entries(textSpec).map(([eng, rus]) => (
                        <option key={eng} value={eng}>{rus}</option>
                    ))}
                </select>

                <div className={styles.flex}>
                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.speed}
                        onChange={e => handleChange('speed', e.target.value.replace(/\D/g, ''))}
                    >
                        Скорость
                    </Input>

                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.ac}
                        onChange={e => handleChange('ac', e.target.value.replace(/\D/g, ''))}
                    >
                        AC
                    </Input>

                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.hits}
                        onChange={e => handleChange('hits', e.target.value.replace(/\D/g, ''))}
                    >
                        Хиты
                    </Input>

                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.initiative}
                        onChange={e => handleChange('initiative', e.target.value.replace(/\D/g, ''))}
                    >
                        Инициатива
                    </Input>

                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.level}
                        onChange={e => handleChange('level', e.target.value.replace(/\D/g, ''))}
                    >
                        Уровень
                    </Input>
                </div>

                <h3>Характеристики</h3>
                <div className={styles.flex}>
                    {Object.keys(formValues.characteristics).map(key => (
                        <Input
                            key={key}
                            type="text"
                            inputMode="numeric"
                            value={formValues.characteristics[key as keyof Characteristics].toString()}
                            onChange={e => handleCharacteristicChange(
                                key as keyof Characteristics,
                                Number(e.target.value) || 0
                            )}
                        >
                            {key}
                        </Input>
                    ))}
                </div>

                <h3>Языки</h3>
                <div className={styles.languagesContainer}>
                    { Object.entries(textLanguages).map(([eng, rus]) => (
                        <label key={eng} className={styles.languageLabel}>
                            <input
                                type="checkbox"
                                value={eng}
                                checked={formValues.languages.includes(eng)}
                                onChange={e => {
                                    const isChecked = e.target.checked;
                                    setFormValues(prev => ({
                                        ...prev,
                                        languages: isChecked
                                            ? [...prev.languages, eng]
                                            : prev.languages.filter(lang => lang !== eng)
                                    }));
                                }}
                            />
                            {rus}
                        </label>
                    ))}
                </div>

                <h3>Владение оружием</h3>
                <div className={styles.languagesContainer}>
                    {Object.entries(weapons).map(([key, label]) => (
                        <label key={key} className={styles.languageLabel}>
                            <input
                                type="checkbox"
                                value={key}
                                checked={formValues.weapons.includes(key)}
                                onChange={e => {
                                    const isChecked = e.target.checked;
                                    setFormValues(prev => ({
                                        ...prev,
                                        weapons: isChecked
                                            ? [...prev.weapons, key]
                                            : prev.weapons.filter(w => w !== key)
                                    }));
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>

                <h3>Владение бронёй</h3>
                <div className={styles.languagesContainer}>
                    {Object.entries(armors).map(([key, label]) => (
                        <label key={key} className={styles.languageLabel}>
                            <input
                                type="checkbox"
                                value={key}
                                checked={formValues.armors.includes(key)}
                                onChange={e => {
                                    const isChecked = e.target.checked;
                                    setFormValues(prev => ({
                                        ...prev,
                                        armors: isChecked
                                            ? [...prev.armors, key]
                                            : prev.armors.filter(a => a !== key)
                                    }));
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>
                <h3>Владение инструментами</h3>
                <div className={styles.toolsContainer}>
                    {Object.entries(tools).map(([key, label]) => (
                        <label key={key} className={styles.toolLabel}>
                            <input
                                type="checkbox"
                                value={key}
                                checked={formValues.tools.includes(key)}
                                onChange={e => {
                                    const isChecked = e.target.checked;
                                    setFormValues(prev => ({
                                        ...prev,
                                        tools: isChecked
                                            ? [...prev.tools, key]
                                            : prev.tools.filter(a => a !== key)
                                    }));
                                }}
                            />
                            {label}
                        </label>
                    ))}
                </div>

                <div className={styles.modalButtons}>
                    <Btn type="submit">Сохранить</Btn>
                    <Btn onClick={onClose}>Отмена</Btn>
                </div>
            </form>
        </div>
    );
}

export default EditCharacterModal;