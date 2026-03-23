import type { Character } from '../../../types/Character.ts';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './Note.module.css';
import React from "react";

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

export default function Note({
                                 character,
                                 updateCharacter,
                                 isOpen,
                                 toggleOpen,
                                 addNote,
                                 deleteNote,
                                 activeIndex,
                                 setActiveNote
                             }: NoteProps) {

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = [...(character.note || [])];
        newNotes[activeIndex] = e.target.value;
        updateCharacter({ ...character, note: newNotes });
    };

    const getTabName = (note: string) => {
        const firstWord = note.trim().split(/\s+/)[0];
        return firstWord || 'Новая';
    };

    return (
        <div className={styles.noteContainer}>
            <div className={styles.toggleBtn} onClick={toggleOpen}>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
            </div>

            <div className={`${styles.textareaWrapper} ${isOpen ? styles.open : ''}`}>
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsScroll}>
                        {(character.note || []).map((note, i) => (
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
                    <textarea
                        className={styles.contentEditable}
                        value={(character.note && character.note[activeIndex]) || ''}
                        onChange={handleChange}
                        placeholder="Заметка..."
                    />
                    <Btn onClick={() => deleteNote(activeIndex)} classBtn='delete' />
                </div>
            </div>
        </div>
    );
}