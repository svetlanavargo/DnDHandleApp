import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Character, CharacterNote } from '../../../types/Character.ts';
import Btn from '../../UI/Btn/Btn.tsx';
import { createCharacterNote } from '../../../utils/characterNotes.ts';
import styles from './Note.module.css';

interface NoteProps {
    character: Character;
    notes: CharacterNote[];
    updateCharacter: (updated: Character) => void;
    isOpen: boolean;
    toggleOpen: () => void;
    deleteNote: (id: string) => void;
    reorderNotes: (fromId: string, toId: string) => void;
    activeNoteId: string | null;
    setActiveNote: (id: string | null) => void;
}

interface NoteEditorProps {
    initialValue: string;
    onBlur: (value: string) => void;
}

interface NoteEditorHandle {
    getValue: () => string;
}

const NoteEditor = memo(forwardRef<NoteEditorHandle, NoteEditorProps>(function NoteEditor({ initialValue, onBlur }: NoteEditorProps, ref) {
    const [draft, setDraft] = useState(initialValue);

    useImperativeHandle(ref, () => ({
        getValue: () => draft
    }), [draft]);

    return (
        <textarea
            className={styles.contentEditable}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => onBlur(draft)}
            placeholder="Заметка..."
        />
    );
}));

function Note({
                                 character,
                                 notes,
                                 updateCharacter,
                                 isOpen,
                                 toggleOpen,
                                 deleteNote,
                                 reorderNotes,
                                 activeNoteId,
                                 setActiveNote
                             }: NoteProps) {
    const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
    const [dropTargetNoteId, setDropTargetNoteId] = useState<string | null>(null);
    const editorRef = useRef<NoteEditorHandle | null>(null);
    const activeNote = useMemo(
        () => notes.find(note => note.id === activeNoteId) ?? notes[0] ?? null,
        [notes, activeNoteId]
    );

    const commitActiveNote = useCallback((value: string) => {
        if (!activeNote) {
            return;
        }

        const newNotes = notes.map(note =>
            note.id === activeNote.id ? { ...note, text: value } : note
        );

        if (value === activeNote.text) {
            return;
        }

        updateCharacter({ ...character, note: newNotes });
    }, [activeNote, character, notes, updateCharacter]);

    const handleBlur = useCallback((value: string) => {
        commitActiveNote(value);
    }, [commitActiveNote]);

    const saveCurrentDraft = useCallback(() => {
        const currentDraft = editorRef.current?.getValue();

        if (typeof currentDraft !== 'string') {
            return;
        }

        commitActiveNote(currentDraft);
    }, [commitActiveNote]);

    const handleAddNote = useCallback(() => {
        const currentDraft = editorRef.current?.getValue();

        const syncedNotes = activeNote && typeof currentDraft === 'string'
            ? notes.map(note =>
                note.id === activeNote.id ? { ...note, text: currentDraft } : note
            )
            : notes;

        const nextNote = createCharacterNote('');

        updateCharacter({
            ...character,
            note: [...syncedNotes, nextNote]
        });

        setActiveNote(nextNote.id);
    }, [activeNote, character, notes, setActiveNote, updateCharacter]);

    const getTabName = useCallback((noteText: string) => {
        const firstLine = noteText.trim().split(/\r?\n/)[0];
        return firstLine || 'Новая';
    }, []);

    return (
        <div className={styles.noteContainer}>
            <div className={styles.toggleBtn} onClick={toggleOpen}>
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}></span>
            </div>

            <div className={`${styles.textareaWrapper} ${isOpen ? styles.open : ''}`}>
                <div className={styles.tabsWrapper}>
                    <div className={styles.tabsScroll}>
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                draggable
                                className={`
                                    ${styles.tab}
                                    ${note.id === activeNote?.id ? styles.activeTab : ''}
                                    ${note.id === draggedNoteId ? styles.draggingTab : ''}
                                    ${note.id === dropTargetNoteId ? styles.dropTargetTab : ''}
                                `}
                                onClick={() => {
                                    saveCurrentDraft();
                                    setActiveNote(note.id);
                                }}
                                onDragStart={() => setDraggedNoteId(note.id)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (note.id !== draggedNoteId) {
                                        setDropTargetNoteId(note.id);
                                    }
                                }}
                                onDrop={() => {
                                    if (draggedNoteId) {
                                        reorderNotes(draggedNoteId, note.id);
                                    }
                                    setDraggedNoteId(null);
                                    setDropTargetNoteId(null);
                                }}
                                onDragEnd={() => {
                                    setDraggedNoteId(null);
                                    setDropTargetNoteId(null);
                                }}
                            >
                                <span>{getTabName(note.text)}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.btnWrapper}>
                        <Btn onClick={handleAddNote} classBtn='addCharacter' />
                    </div>
                </div>

                <div className={styles.noteWrapper}>
                    <div className={styles.deleteWrap}>
                        {activeNote && (
                            <Btn onClick={() => deleteNote(activeNote.id)} classBtn='delete' />
                        )}
                    </div>
                    {activeNote && (
                        <NoteEditor
                            ref={editorRef}
                            key={`${character.id}-${activeNote.id}-${activeNote.text}`}
                            initialValue={activeNote.text}
                            onBlur={handleBlur}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(Note);
