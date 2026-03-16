import { useState, useEffect, useRef } from 'react';
import type { Condition } from '../../hooks/useBattle.ts';
import styles from './Modals.module.css';
import Input from "../UI/Input/Input.tsx";
import Btn from "../UI/Btn/Btn.tsx";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (condition: Condition) => void;
}

export default function ConditionModal({ isOpen, onClose, onAdd }: Props) {
    const [name, setName] = useState('');
    const [type, setType] = useState<'round' | 'time'>('round');
    const [duration, setDuration] = useState<number>(1);
    const [durationInput, setDurationInput] = useState<string>(duration.toString());

    const nameInputRef = useRef<HTMLInputElement>(null);

    // автофокус
    useEffect(() => {
        if (!isOpen) return;

        const id = setTimeout(() => {
            nameInputRef.current?.focus();
        }, 0);

        return () => clearTimeout(id);
    }, [isOpen]);

    if (!isOpen) return null;

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
        <div className={styles.modalOverlay} onClick={onClose}>
            <form
                className={styles.modalContent}
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

                <label>
                    Тип:
                    <select
                        value={type}
                        onChange={e => setType(e.target.value as 'round' | 'time')}
                    >
                        <option value="round">Раунды</option>
                        <option value="time">Минуты</option>
                    </select>
                </label>
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
                </div>
            </form>
        </div>
    );
}