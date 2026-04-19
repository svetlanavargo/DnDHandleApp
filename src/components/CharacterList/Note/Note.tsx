import { memo, useCallback, useMemo } from 'react';
import type { Character } from '../../../types/Character.ts';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './Note.module.css';

interface NoteProps {
    character: Character;
    updateCharacter: (updated: Character) => void;
    isOpen: boolean;
    toggleOpen: () => void;
    addNote: () => void;
    deleteNote: (index: number) => void;
    activeIndex: number;
    setActiveNote: (index: number) => void;
}

function Note({
                                 character,
                                 updateCharacter,
                                 isOpen,
                                 toggleOpen,
                                 addNote,
                                 deleteNote,
                                 activeIndex,
                                 setActiveNote
                             }: NoteProps) {

    const notes = useMemo(() => character.note || [], [character.note]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = [...(character.note || [])];
        newNotes[activeIndex] = e.target.value;
        updateCharacter({ ...character, note: newNotes });
    }, [character, activeIndex, updateCharacter]);

    const getTabName = useCallback((note: string) => {
        const firstLine = note.trim().split(/\r?\n/)[0];
        return firstLine || 'Новая';
    }, []);

    const activeNote = useMemo(
        () => notes[activeIndex] || '',
        [notes, activeIndex]
    );

    return (
        <div className={styles.noteContainer}>
            <div className={styles.toggleBtn} onClick={toggleOpen}>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}></span>
            </div>

            <div className={`${styles.textareaWrapper} ${isOpen ? styles.open : ''}`}>
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsScroll}>
                        {notes.map((note, i) => (
                            <div
                                key={i}
                                className={`${styles.tab} ${i === activeIndex ? styles.activeTab : ''}`}
                                onClick={() => setActiveNote(i)}
                            >
                                <span>{getTabName(note)}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.btnWrapper}>
                        <Btn onClick={addNote} classBtn='addCharacter' />
                    </div>
                </div>

                <div className={styles.noteWrapper}>
                    <div className={styles.deleteWrap}>
                        <Btn onClick={() => deleteNote(activeIndex)} classBtn='delete' />
                    </div>
                    <textarea
                        className={styles.contentEditable}
                        value={activeNote}
                        onChange={handleChange}
                        placeholder="Заметка..."
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(Note);
