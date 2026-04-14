import React from 'react';
import { Link } from 'react-router-dom';
import type { ClassKey } from '../../../types/dnd';
import Btn from '../../UI/Btn/Btn';
import ClassIcon from '../../UI/ClassIcon/ClassIcon';
import styles from './EmptyState.module.css';

type Props = {
    title?: string;
    text?: string;
    image?: React.ReactNode;

    linkText?: string;
    linkTo?: string;

    buttonText?: string;
    onButtonClick?: () => void;

    className?: string;

    classIcon?: {
        spec: ClassKey;
        size?: 'small' | 'medium' | 'big';
        label?: string;
    };
};

function EmptyState({
                        title,
                        text,
                        image,
                        linkText,
                        linkTo,
                        buttonText,
                        onButtonClick,
                        classIcon,
                        className
                    }: Props) {
    return (
        <div className={`${styles.container} ${className ?? ''}`}>

            {/* IMAGE / ICON */}
            {image && <div className={styles.image}>{image}</div>}

            {classIcon && (
                <ClassIcon
                    spec={classIcon.spec}
                    size={classIcon.size ?? 'big'}
                />
            )}

            {/* TITLE */}
            {title && <h2 className={styles.title}>{title}</h2>}

            {/* TEXT */}
            {text && <p className={styles.text}>{text}</p>}

            {/* LINK */}
            {linkTo && linkText && (
                <Link to={linkTo} className={styles.link}>
                    {linkText}
                </Link>
            )}

            {/* BUTTON */}
            {buttonText && (
                <Btn onClick={onButtonClick} classBtn="addHits"/>
            )}
        </div>
    );
}

export default EmptyState;