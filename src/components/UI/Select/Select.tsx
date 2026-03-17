import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

interface SelectProps {
    value?: string;
    onChange: (value?: string) => void;
    options: Record<string, string>;
    label?: string;
    placeholder?: string;
}

function Select({value, placeholder, options, label, onChange}: SelectProps) {

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.wrapper} ref={ref}>
            {label && <div className={styles.label}>{label}</div>}
            <div className={styles.selected} onClick={() => setOpen(prev => !prev)}>
                {value ? options[value] : placeholder || '— Выберите —'}
                <span className={`${styles.arrow} ${open ? styles.open : ''}`} />
            </div>

            {open && (
                <div className={styles.dropdown}>
                    {placeholder && (
                        <div
                            className={styles.option}
                            onClick={() => {
                                onChange(undefined);
                                setOpen(false);
                            }}
                        >
                            {placeholder}
                        </div>
                    )}
                    {Object.entries(options).map(([key, display]) => (
                        <div
                            key={key}
                            className={styles.option}
                            onClick={() => {
                                onChange(key);
                                setOpen(false);
                            }}
                        >
                            {display}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;