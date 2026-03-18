import Btn from '../UI/Btn/Btn.tsx';
import styles from "./Modals.module.css";

interface NoticesProps {
    message: string | string[];
    onClose: () => void;
}

function NoticesModal({ message, onClose }: NoticesProps) {
    const messages = Array.isArray(message) ? message : [message];

    return (
        <div className={styles.expiredNoticesContent}>
            <h2>Мастер!</h2>
            {messages.map((msg, i) => (
                <div key={i} className={styles.notices}>{msg}</div>
            ))}
            <Btn onClick={onClose}>Закрыть</Btn>
        </div>
    );
}

export default NoticesModal;