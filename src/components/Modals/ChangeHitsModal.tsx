import { useState, useRef, useEffect, useCallback } from 'react';
import Btn from '../UI/Btn/Btn';
import Input from '../UI/Input/Input';
import styles from './Modals.module.css';

interface ChangeHitsModalProps {
    title: string;
    min?: number;
    max?: number;
    onConfirm: (value: number) => void;
    onClose: () => void;
}

function ChangeHitsModal({ title, min, max, onConfirm, onClose }: ChangeHitsModalProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInput('');
        inputRef.current?.focus();
    }, []);

    const handleConfirm = useCallback(() => {
        let value = Number(input);
        if (isNaN(value)) value = min ?? 0;

        if (min !== undefined && value < min) value = min;
        if (max !== undefined && value > max) value = max;

        setInput(value.toString());
        onConfirm(value);
        onClose();
    }, [input, min, max, onConfirm, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // оставляем только цифры и минус в начале
        value = value.replace(/[^0-9-]/g, '');
        value = value.replace(/(?!^)-/g, '');

        // если введен только "-", пока не меняем лимиты
        if (value === '-') {
            setInput(value);
            return;
        }

        let numeric = Number(value);
        if (!isNaN(numeric)) {
            // применяем лимиты прямо при вводе
            if (min !== undefined && numeric < min) numeric = min;
            if (max !== undefined && numeric > max) numeric = max;

            setInput(numeric.toString());
        } else {
            setInput(''); // если пусто или не число
        }
    };

    return (
        <div className={styles.expiredNoticesContent}>
            <h2>{title}</h2>
            <Input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={input}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                    if (e.key === 'Escape') onClose();
                }}
            />
            <div className={styles.modalButtons}>
                <Btn onClick={handleConfirm} classBtn="btnColor">Готово</Btn>
                <Btn onClick={onClose}>Отмена</Btn>
            </div>
        </div>
    );
}

export default ChangeHitsModal;