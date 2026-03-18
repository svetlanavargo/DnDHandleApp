import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps {
    children?: React.ReactNode;
    type: "text" | "number";
    inputMode?: "text" | "numeric";
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ children, ...props }, ref) => {
    return (
        <label className={styles.label}>
            {children}
            <input ref={ref} {...props} />
        </label>
    );
});

export default Input;