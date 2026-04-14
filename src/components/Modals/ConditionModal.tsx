import React, { useState, useEffect, useRef } from 'react';
import type { CreateCondition } from '../../types/dnd.ts';
import type { BattleCard } from "../../hooks/useBattle.ts";
import styles from './Modals.module.css';
import Input from "../UI/Input/Input.tsx";
import CheckboxDropdown from '../UI/CheckboxDropdown/CheckboxDropdown.tsx';
import Select from '../UI/Select/Select.tsx';
import Btn from "../UI/Btn/Btn.tsx";

interface Props {
    onClose: () => void;
    onAdd: (condition: CreateCondition, targetIds: string[]) => void;
    cards: BattleCard[];
}

const CONDITIONS: Record<string, string> = {
    blinded: "Ослеплён",
    charmed: "Очарован",
    deafened: "Ошеломленный",
    frightened: "Испуган",
    grappled: "Схвачен",
    incapacitated: "Недееспособен",
    invisible: "Невидим",
    petrified: "Окаменел",
    poisoned: "Отравлен",
    prone: "Сбит с ног",
    restrained: "Опутан",
    stunned: "Ошеломлён",
    unconscious: "Без сознания",
    concentration: "Концентрирующийся"
};

function findBestMatch(input: string): string | undefined {
    const lower = input.toLowerCase();

    return Object.entries(CONDITIONS).find(([key, label]) =>
        key.includes(lower) || label.toLowerCase().includes(lower)
    )?.[0];
}

export default function ConditionModal({ onClose, onAdd, cards }: Props) {
    const [search, setSearch] = useState('');
    const [selectedCondition, setSelectedCondition] = useState<string | undefined>();

    const [customCondition, setCustomCondition] = useState<string>('');

    const [targets, setTargets] = useState<string[]>([]);
    const [type, setType] = useState<'round' | 'time'>('round');
    const [duration, setDuration] = useState<number>(1);
    const [durationInput, setDurationInput] = useState<string>('1');

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const id = setTimeout(() => {
            nameInputRef.current?.focus();
        }, 0);

        return () => clearTimeout(id);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalKey = selectedCondition ?? customCondition;

        if (!finalKey) return;

        onAdd(
            {
                id: Math.random().toString(36).slice(2, 11),
                name: finalKey,
                label: CONDITIONS[finalKey] ?? finalKey,
                type,
                duration
            },
            targets
        );
        onClose();
    };

    const targetOptions = cards.map(card => ({
        value: card.id,
        label: card.name
    }));

    const selectedTargetsLabel =
        targets.length === 0
            ? "По умолчанию: сам персонаж"
            : "Цели";

    return (
        <div>
            <form
                className={styles.form}
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h2>Добавить состояние</h2>

                <CheckboxDropdown
                    label={selectedTargetsLabel}
                    options={targetOptions}
                    selected={targets}
                    onChange={setTargets}
                />

                {/* INPUT */}
                <Input
                    ref={nameInputRef}
                    type="text"
                    value={search}
                    onChange={e => {
                        const val = e.target.value;

                        setSearch(val);

                        const match = findBestMatch(val);

                        if (match) {
                            setSelectedCondition(match);
                            setCustomCondition('');
                        } else {
                            setSelectedCondition(undefined);
                            setCustomCondition(val); // 👈 ВАЖНО
                        }
                    }}
                >
                    Введите состояние
                </Input>

                {/* fallback select */}
                <Select
                    label="или выберите стандартное"
                    value={selectedCondition}
                    placeholder="Выбрать состояние"
                    options={CONDITIONS}
                    onChange={(value) => {
                        setSelectedCondition(value);
                        setCustomCondition('');
                        setSearch('');
                    }}
                />

                {/* duration */}
                <Input
                    type="text"
                    inputMode="numeric"
                    value={durationInput}
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setDurationInput(val);
                        if (val) setDuration(Math.max(1, Number(val)));
                    }}
                    onBlur={() => {
                        if (!durationInput) {
                            setDurationInput('1');
                            setDuration(1);
                        }
                    }}
                >
                    Продолжительность
                </Input>

                {/* type */}
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

                <div className={styles.modalButtons}>
                    <Btn type="submit" classBtn="btnColor">
                        Добавить
                    </Btn>
                    <Btn onClick={onClose}>
                        Отмена
                    </Btn>
                </div>
            </form>
        </div>
    );
}