import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children?: React.ReactNode;
    type: "text" | "number" | "password" | "email";
    inputMode?: "text" | "numeric";
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    autoComplete?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            children,
            autoComplete = 'off',
            ...props
        },
        ref
    ) => {
        return (
            <label className={styles.label}>
                {children}
                <input
                    className={styles.input}
                    ref={ref}
                    {...props}
                    autoComplete={autoComplete}
                />
            </label>
        );
    }
);

export default Input;