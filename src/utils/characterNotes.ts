import type { CharacterNote, NotesInput } from '../types/Character';

export function createCharacterNote(text = ''): CharacterNote {
    return {
        id: crypto.randomUUID(),
        text,
    };
}

export function isCharacterNote(value: unknown): value is CharacterNote {
    return !!value &&
        typeof value === 'object' &&
        typeof (value as CharacterNote).id === 'string' &&
        typeof (value as CharacterNote).text === 'string';
}

export function normalizeCharacterNotes(notes: NotesInput | undefined): CharacterNote[] {
    if (!Array.isArray(notes)) {
        return [];
    }

    return notes.map((note) => {
        if (isCharacterNote(note)) {
            return note;
        }

        return createCharacterNote(typeof note === 'string' ? note : '');
    });
}

export function reorderCharacterNotes(
    notes: CharacterNote[],
    fromId: string,
    toId: string
) {
    if (fromId === toId) {
        return notes;
    }

    const fromIndex = notes.findIndex(note => note.id === fromId);
    const toIndex = notes.findIndex(note => note.id === toId);

    if (fromIndex === -1 || toIndex === -1) {
        return notes;
    }

    const nextNotes = [...notes];
    const [moved] = nextNotes.splice(fromIndex, 1);
    nextNotes.splice(toIndex, 0, moved);

    return nextNotes;
}
