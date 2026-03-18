import React, { useState, useEffect, useRef } from 'react';
import type { Condition } from '../../hooks/useBattle.ts';
import styles from './Modals.module.css';
import Input from "../UI/Input/Input.tsx";
import Select from '../UI/Select/Select.tsx';
import Btn from "../UI/Btn/Btn.tsx";

interface Props {
    onClose: () => void;
    onAdd: (condition: Condition) => void;
}

export default function ConditionModal({ onClose, onAdd }: Props) {
    const [name, setName] = useState('');
    const [type, setType] = useState<'round' | 'time'>('round');
    const [duration, setDuration] = useState<number>(1);
    const [durationInput, setDurationInput] = useState<string>(duration.toString());

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const id = setTimeout(() => {
            nameInputRef.current?.focus();
        }, 0);

        return () => clearTimeout(id);
    }, []);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onAdd({
            id: Math.random().toString(36).slice(2, 11),
            name,
            type,
            duration,
            remaining: duration
        });

        setName('');
        setDuration(1);
        setType('round');
        onClose();
    };

    return (
        <div>
            <form
                className={styles.form}
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h2>Добавить состояние</h2>

                <Input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                >
                    Название состояния:
                </Input>

                <Select
                    label="Тип"
                    value={type}
                    placeholder="Выбрать тип"
                    options={{
                        round: "Раунды",
                        time: "Минуты"
                    }}
                    onChange={(value) => setType(value as 'round' | 'time')}
                />

                <Input
                    type="text"
                    inputMode="numeric"
                    value={durationInput}
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, ''); // оставляем только цифры
                        setDurationInput(val);
                        if (val) setDuration(Math.max(1, Number(val))); // обновляем число только если есть цифры
                    }}
                    onBlur={() => {
                        if (!durationInput) {
                            setDurationInput('1');
                            setDuration(1);
                        }
                    }}
                >
                    Продолжительность:
                </Input>

                <div className={styles.modalButtons}>
                    <Btn type="submit">Добавить</Btn>
                    <Btn onClick={onClose}>Отмена</Btn>
                </div>
            </form>
        </div>
    );
}