import { createPortal } from 'react-dom';
import Dice from './Dice/Dice.tsx';
import Btn from '../UI/Btn/Btn.tsx';
import styles from './DiceModal.module.css';

interface DiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function DiceModal({ isOpen, onClose }: DiceModalProps) {
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
                <Dice />
            </div>
        </div>,
        document.body
    );
}

export default DiceModal;