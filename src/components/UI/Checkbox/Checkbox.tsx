import React from "react";
import styles from './Checkbox.module.css';

interface Props {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const Checkbox: React.FC<Props> = ({ label, checked, onChange, disabled }) => {
    return (
        <label className={`${styles.checkboxLabel} ${disabled ? styles.disabled : ''}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className={styles.customBox}>
        {checked && <span className={styles.checkmark} />}
      </span>
            {label}
        </label>
    );
};

export default Checkbox;