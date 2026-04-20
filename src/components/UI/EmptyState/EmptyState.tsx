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
    buttonDisabled?: boolean;
    statusText?: string;

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
                        buttonDisabled,
                        statusText,
                        classIcon,
                        className
                    }: Props) {
    return (
        <div className={`${styles.container} ${className ?? ''}`}>
            <div className={styles.card}>
                {(image || classIcon) && (
                    <div className={styles.visualShell}>
                        {image && <div className={styles.image}>{image}</div>}

                        {classIcon && (
                            <ClassIcon
                                spec={classIcon.spec}
                                size={classIcon.size ?? 'big'}
                            />
                        )}
                    </div>
                )}

                <div className={styles.content}>
                    {title && <h2 className={styles.title}>{title}</h2>}

                    {text && (
                        <p className={styles.text}>
                            {text}
                            {linkTo && linkText && (
                                <>
                                    {' '}
                                    <Link to={linkTo} className={styles.link}>
                                        {linkText}
                                    </Link>
                                </>
                            )}
                        </p>
                    )}

                    {!text && linkTo && linkText && (
                        <Link to={linkTo} className={styles.link}>
                            {linkText}
                        </Link>
                    )}

                    {buttonText && (
                        <div className={styles.actions}>
                            <Btn
                                onClick={onButtonClick}
                                classBtn="btnColor"
                                disabled={buttonDisabled}
                            >
                                {buttonText}
                            </Btn>
                        </div>
                    )}

                    {statusText && (
                        <p className={styles.statusText}>{statusText}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmptyState;
