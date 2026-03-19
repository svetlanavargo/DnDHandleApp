import type { Character } from '../../../types/Character.ts';
import styles from './Note.module.css';

interface NoteProps {
    text: string;
    isOpen: boolean;
    toggleOpen: () => void;
    character: Character;
    updateCharacter: (updated: Character) => void;
}

function Note({ text, isOpen, toggleOpen, character, updateCharacter }: NoteProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateCharacter({ ...character, note: e.target.value });
    };

    return (
        <div className={styles.noteContainer}>
            <div className={styles.toggleBtn} onClick={toggleOpen}>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
            </div>

            <div
                className={`${styles.textareaWrapper} ${isOpen ? styles.open : ''}`}
            >
                <div className={styles.noteWrapper}>
                     <textarea
                         className={styles.contentEditable}
                         value={text}
                         onChange={handleChange}
                         placeholder="Заметки..."
                     />
                </div>
            </div>
        </div>
    );
}

export default Note;