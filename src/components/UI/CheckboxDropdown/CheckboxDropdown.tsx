import { useState, useRef, useEffect } from "react";
import Сheckbox from "../Checkbox/Checkbox";
import styles from './CheckboxDropdown.module.css';

interface Option {
    value: string;
    label: string;
}

interface Props {
    label: string;
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export default function CheckboxDropdown({ label, options, selected, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне блока
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <div className={styles.dropdown} ref={ref}>
            <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setOpen(prev => !prev)}
            >
                {label} ({selected.length})
                <span className={`${styles.arrow} ${open ? styles.open : ""}`} />
            </button>

            {open && (
                <div className={styles.options}>
                    {options.map(opt => (
                        <div key={opt.value} className={styles.optionLabel}>
                            <Сheckbox
                                label={opt.label}
                                checked={selected.includes(opt.value)}
                                onChange={() => toggleOption(opt.value)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}