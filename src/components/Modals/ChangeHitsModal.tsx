import { useState, useRef, useEffect, useCallback } from 'react';
import Btn from '../UI/Btn/Btn';
import Input from '../UI/Input/Input';
import styles from './Modals.module.css';

interface ChangeHitsModalProps {
    title: string;
    name?: string;
    min?: number;
    max?: number;
    onConfirm: (value: number) => void;
    onClose: () => void;
}

function ChangeHitsModal({
                             title,
                             name,
                             min,
                             max,
                             onConfirm,
                             onClose,
                         }: ChangeHitsModalProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInput('');
        inputRef.current?.focus();
    }, []);

    const handleConfirm = useCallback(() => {
        const value = Number(input);

        if (isNaN(value)) return alert('Введите число');
        if (min !== undefined && value < min) return alert(`Минимум: ${min}`);
        if (max !== undefined && value > max) return alert(`Максимум: ${max}`);

        onConfirm(value);
        onClose();
    }, [input, min, max, onConfirm, onClose]);

    return (
        <div className={styles.expiredNoticesContent}>
            <h2>{title} {name ? name : ''}</h2>
            <Input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                    if (e.key === 'Escape') onClose();
                }}
            />
            <div className={styles.modalButtons}>
                <Btn onClick={handleConfirm} classBtn="textDelete">Готово</Btn>
                <Btn onClick={onClose}>Отмена</Btn>
            </div>
        </div>
    );
}

export default ChangeHitsModal;