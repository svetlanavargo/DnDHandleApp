import React from 'react';
import { createPortal } from 'react-dom';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './PortalModal.module.css';

interface PortalModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function PortalModal({ isOpen, onClose, children }: PortalModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.close}>
                    <Btn onClick={onClose} classBtn='close'/>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default PortalModal;