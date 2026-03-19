import React, { useState, useEffect, useRef } from 'react';
import type { Card } from '../../types/CardInBattleTracker.ts';
import Btn from '../UI/Btn/Btn.tsx';
import TextArea from '../UI/Input/TextArea.tsx';
import Input from '../UI/Input/Input.tsx';
import styles from './Modals.module.css';
import Select from "../UI/Select/Select.tsx";
import Checkbox from "../UI/Checkbox/Checkbox.tsx";

interface CardModalProps {
    onClose: () => void;
    onSubmit: (data: Omit<Card, 'id'>) => void;
    initialValues?: Omit<Card, 'id'>;
}

type FormValues = {
    name: string;
    maxHits: string;
    currentHits: string;
    ac: string;
    note: string;
    isPlayer: boolean;
    initiativeBonus: string;
    color?: 'red' | 'blue' | 'green';
};

const defaultForm: FormValues = {
    name: '',
    maxHits: '10',
    currentHits: '',
    ac: '10',
    note: '',
    isPlayer: false,
    initiativeBonus: '0',
    color: undefined
};

function CreateCardModal({ onClose, onSubmit, initialValues }: CardModalProps) {
    const [formValues, setFormValues] = useState<FormValues>(defaultForm);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // синхронизация формы при открытии модалки
    useEffect(() => {
        if (initialValues) {
            setFormValues({
                name: initialValues.name,
                maxHits: initialValues.maxHits.toString(),
                currentHits: initialValues.currentHits.toString(),
                ac: initialValues.ac.toString(),
                note: initialValues.note ?? '',
                isPlayer: initialValues.isPlayer,
                initiativeBonus: initialValues.initiativeBonus.toString(),
                color: initialValues.color
            });
        } else {
            setFormValues(defaultForm);
        }

        // автофокус
        const id = setTimeout(() => firstInputRef.current?.focus(), 0);
        return () => clearTimeout(id);
    }, [initialValues]);

    const handleChange = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
        setFormValues(prev => {
            const updated = { ...prev, [field]: value };

            // если снимаем флажок игрока, сбрасываем цвет
            if (field === 'isPlayer' && value === false) {
                updated.color = undefined;
            }

            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const data: Omit<Card, 'id'> = {
            name: formValues.name,
            maxHits: Number(formValues.maxHits),
            currentHits:
                formValues.currentHits === ''
                    ? Number(formValues.maxHits)
                    : Number(formValues.currentHits),
            ac: Number(formValues.ac),
            note: formValues.note,
            isPlayer: formValues.isPlayer,
            initiativeBonus: Number(formValues.initiativeBonus),
            color: formValues.color
        };

        onSubmit(data);
        setFormValues(defaultForm);
        onClose();
    };

    return (
        <div>
            <form className={styles.form}
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h2>{initialValues ? 'Редактировать карточку' : 'Новая карточка'}</h2>

                <Input
                    ref={firstInputRef}
                    type="text"
                    value={formValues.name}
                    onChange={e => {
                        const val = e.target.value.slice(0, 100);
                        handleChange('name', val);
                    }}
                >
                    Имя:
                </Input>

                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.maxHits}
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val === '') {
                            handleChange('maxHits', '');
                            return;
                        }
                        let num = Number(val);
                        if (num > 1000) num = 1000;
                        handleChange('maxHits', num.toString());
                    }}
                >
                    Максимум хитов:
                </Input>

                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.currentHits}
                    onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (Number(val) > 1000) val = '1000';
                        handleChange('currentHits', val);
                    }}
                >
                    Текущие хиты:
                </Input>

                <Input
                    type="text"
                    inputMode="numeric"
                    value={formValues.ac}
                    onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (Number(val) > 100) val = '100';
                        handleChange('ac', val);
                    }}
                >
                    Класс Доспеха:
                </Input>

                <Checkbox
                    label="Это игрок?"
                    checked={formValues.isPlayer}
                    onChange={(checked) => handleChange('isPlayer', checked)}
                />

                {!formValues.isPlayer && (
                    <Input
                        type="text"
                        inputMode="numeric"
                        value={formValues.initiativeBonus}
                        onChange={e => {
                            const val = e.target.value;
                            if (val === '') {
                                handleChange('initiativeBonus', '');
                                return;
                            }
                            if (!/^(-?\d*)$/.test(val)) return;
                            if (val === '-') {
                                handleChange('initiativeBonus', '-');
                                return;
                            }
                            let num = Number(val);
                            if (num > 100) num = 100;
                            if (num < -100) num = -100;

                            handleChange('initiativeBonus', num.toString());
                        }}
                    >
                        Бонус инициативы:
                    </Input>
                )}

                {formValues.isPlayer && (
                    <Select
                        label="Цвет игрока"
                        value={formValues.color}
                        placeholder="Выбрать цвет"
                        options={{
                            red: "🔴",
                            blue: "🔵",
                            green: "🟢"
                        }}
                        onChange={(value) => handleChange('color', value as 'red' | 'blue' | 'green')}
                    />
                )}

                <TextArea value={formValues.note}
                          onChange={e => handleChange('note', e.target.value)}>
                    Заметка:
                </TextArea>

                <div className={styles.modalButtons}>
                    <Btn type="submit"  classBtn='btnColor'>
                        {initialValues ? 'Сохранить' : 'Готово'}
                    </Btn>
                    <Btn onClick={onClose}>
                        Отмена
                    </Btn>
                </div>
            </form>
        </div>
    );
}

export default CreateCardModal;