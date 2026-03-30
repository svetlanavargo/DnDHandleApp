import type {ReactNode} from 'react';
import styles from './Btn.module.css';

interface BtnProps {
    children?: ReactNode,
    onClick?: () => void,
    classBtn?: string,
    type?: 'submit' | 'button',
    disabled?: boolean
}

function Btn({children, onClick, classBtn, disabled, type='button'}: BtnProps) {
    return (
        <button
            type={type}
            className={classBtn ? styles[classBtn] : ''}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Btn
