import Btn from '../UI/Btn/Btn.tsx';
import styles from './Modals.module.css';

interface ConfirmProps {
    onClose: () => void;
    onConfirm: () => void;
}

function Confirm({ onClose, onConfirm }: ConfirmProps) {
    return (
        <div className={styles.expiredNoticesContent}>
            <h2>Выйти из аккаунта?</h2>
            <div className={styles.modalButtons}>
                <Btn onClick={onConfirm} classBtn='btnColor'>Выйти</Btn>
                <Btn onClick={onClose}>Остаться</Btn>
            </div>
        </div>
    );
}

export default Confirm;
