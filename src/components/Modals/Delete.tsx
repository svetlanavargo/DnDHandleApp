import Btn from '../UI/Btn/Btn.tsx';
import styles from "./Modals.module.css";

interface DeleteProps {
    onClose: () => void;
    name: string;
    remove: () => void;
}

function Delete({ name, onClose, remove }: DeleteProps) {
    return (
        <div className={styles.expiredNoticesContent}>
            <h2>Удалить "{name}"?</h2>
            <div className={styles.modalButtons}>
                <Btn onClick={remove} classBtn='btnRed'>Удалить</Btn>
                <Btn onClick={onClose}>Закрыть</Btn>
            </div>
        </div>
    );
}

export default Delete;