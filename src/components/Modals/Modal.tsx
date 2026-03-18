import React from 'react';
import styles from './Modals.module.css';

interface ModalProps {
    isOpen: boolean;
    size?: "small" | "large";
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, size = "small", children }) => {
    if (!isOpen) return null;

    const sizeClass = size === "large" ? styles.large : styles.small;

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;