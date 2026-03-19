import Btn from '../UI/Btn/Btn.tsx';
import styles from "./Modals.module.css";

interface DeleteCharacterProps {
    onClose: () => void;
    name: string;
    removeCharacter: () => void;
}

function DeleteCharacter({ name, onClose, removeCharacter }: DeleteCharacterProps) {
    return (
        <div className={styles.expiredNoticesContent}>
            <h2>Удалить {name}?</h2>
            <div className={styles.modalButtons}>
                <Btn onClick={removeCharacter} classBtn='btnColor'>Удалить</Btn>
                <Btn onClick={onClose}>Закрыть</Btn>
            </div>
        </div>
    );
}

export default DeleteCharacter;