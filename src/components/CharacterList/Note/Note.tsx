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
    const longPressTimerRef = useRef<number | null>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const suppressClickRef = useRef(false);
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

    const clearLongPressTimer = useCallback(() => {
        if (longPressTimerRef.current !== null) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);

    const resolveNoteIdFromPoint = useCallback((x: number, y: number) => {
        const element = document.elementFromPoint(x, y);

        if (!(element instanceof HTMLElement)) {
            return null;
        }

        const tabElement = element.closest<HTMLElement>('[data-note-id]');
        return tabElement?.dataset.noteId ?? null;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];

        if (!draggedNoteId) {
            if (touchStartRef.current) {
                const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

                if (deltaX > 8 || deltaY > 8) {
                    clearLongPressTimer();
                }
            }

            return;
        }

        if (!draggedNoteId) {
            return;
        }
        const nextTargetId = resolveNoteIdFromPoint(touch.clientX, touch.clientY);

        if (nextTargetId && nextTargetId !== draggedNoteId) {
            setDropTargetNoteId(nextTargetId);
        }
    }, [clearLongPressTimer, draggedNoteId, resolveNoteIdFromPoint]);

    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        clearLongPressTimer();

        if (!draggedNoteId) {
            touchStartRef.current = null;
            return;
        }

        const touch = e.changedTouches[0];
        const droppedOnId =
            resolveNoteIdFromPoint(touch.clientX, touch.clientY) ?? dropTargetNoteId;

        if (droppedOnId && droppedOnId !== draggedNoteId) {
            reorderNotes(draggedNoteId, droppedOnId);
        }

        suppressClickRef.current = true;
        setDraggedNoteId(null);
        setDropTargetNoteId(null);
        touchStartRef.current = null;
    }, [clearLongPressTimer, draggedNoteId, dropTargetNoteId, reorderNotes, resolveNoteIdFromPoint]);

    return (
        <div className={styles.noteContainer}>
            <div
                className={`${styles.toggleBtn} ${isOpen ? styles.toggleBtnOpen : ''}`}
                onClick={toggleOpen}
            >
                <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}></span>
            </div>

            <div className={`${styles.textareaWrapper} ${isOpen ? styles.open : ''}`}>
                <div className={styles.tabsWrapper}>
                    <div className={`${styles.tabsScroll} ${draggedNoteId ? styles.tabsScrollDragging : ''}`}>
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                draggable
                                data-note-id={note.id}
                                className={`
                                    ${styles.tab}
                                    ${note.id === activeNote?.id ? styles.activeTab : ''}
                                    ${note.id === draggedNoteId ? styles.draggingTab : ''}
                                    ${note.id === dropTargetNoteId ? styles.dropTargetTab : ''}
                                `}
                                onClick={() => {
                                    if (suppressClickRef.current) {
                                        suppressClickRef.current = false;
                                        return;
                                    }
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
                                onTouchStart={(e) => {
                                    const touch = e.touches[0];
                                    touchStartRef.current = {
                                        x: touch.clientX,
                                        y: touch.clientY
                                    };
                                    clearLongPressTimer();
                                    longPressTimerRef.current = window.setTimeout(() => {
                                        setDraggedNoteId(note.id);
                                        setDropTargetNoteId(note.id);
                                        suppressClickRef.current = true;
                                    }, 220);
                                }}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onTouchCancel={() => {
                                    clearLongPressTimer();
                                    touchStartRef.current = null;
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
