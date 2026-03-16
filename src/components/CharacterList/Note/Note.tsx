import type { Character } from '../CharacterList.tsx';
import { useRef, useEffect } from 'react';
import styles from './Note.module.css';

interface NoteProps {
    text: string;
    isOpen: boolean;
    toggleOpen: () => void;
    character: Character;
    updateCharacter: (updated: Character) => void;
}

function Note({ text, isOpen, toggleOpen, character, updateCharacter }: NoteProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateCharacter({ ...character, note: e.target.value });
    };

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.selectionStart = textareaRef.current.value.length;
        }
    }, [isOpen]);

    return (
        <div className={styles.noteContainer}>
            <div className={styles.toggleBtn} onClick={toggleOpen}>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
            </div>

            <div
                className={`${styles.textareaWrapper} ${isOpen ? styles.open : ''}`}
            >
                <textarea
                    ref={textareaRef}
                    className={styles.contentEditable}
                    value={text}
                    onChange={handleChange}
                    placeholder="Записывай сюда свое барахло"
                />
            </div>
        </div>
    );
}

export default Note;