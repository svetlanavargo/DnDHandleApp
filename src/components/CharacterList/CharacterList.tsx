import { useList } from '../../hooks/useList';
import { useAuth } from '../../context/auth/useAuth';

import Tabs from '../UI/Tabs/Tabs';
import Warning from '../UI/Warning/Warning';
import List from './List/List';
import Modal from '../Modals/Modal';
import ChangeHitsModal from '../Modals/ChangeHitsModal';
import Delete from '../Modals/Delete';
import CharacterModal from '../Modals/CharacterModal';
import EmptyState from '../UI/EmptyState/EmptyState';
import SessionLoading from '../SessionLoading/SessionLoading';
import { useDelayedFlag } from '../../hooks/useDelayedFlag';

import styles from './CharacterList.module.css';

export default function CharacterList() {
    const list = useList();
    const { loading, user } = useAuth();

    const {
        characters,
        isCharactersLoading,
        addCharacter,
        activeCharacter,
        activeCharacterId,
        setActiveCharacterId,
        actions,
        notes,
        modals
    } = list;

    const deletingNoteTitle = notes.deleteNoteId
        ? notes.normalizedNotes.find(note => note.id === notes.deleteNoteId)?.text.trim().split(/\r?\n/)[0] || 'Новая'
        : 'заметку';
    const isLoading = loading || isCharactersLoading;
    const showSessionLoading = useDelayedFlag(isLoading);

    if (isLoading) {
        if (!showSessionLoading) {
            return null;
        }

        return <SessionLoading />;
    }

    return (
        <div className={styles.characterListContainer}>
            <div className={styles.pageShell}>
                {!user && <Warning />}
                {!activeCharacter ? (
                    <EmptyState
                        image={<div className={styles.img} />}
                        title="Привет игрок!"
                        text="Для создания листа персонажа нажми"
                        buttonText="Создать"
                        buttonDisabled={loading}
                        statusText={loading ? 'Восстанавливаем сессию. Создание персонажей временно недоступно.' : undefined}
                        onButtonClick={() =>
                            modals.setCreatingCharacter(true)
                        }
                    />
                ) : (
                    <div className={styles.characterList}>
                        <div className={styles.tabsShell}>
                            <Tabs
                                items={characters.map(c => ({
                                    id: c.id,
                                    label: c.name
                                }))}
                                activeId={activeCharacterId ?? ''}
                                setActive={setActiveCharacterId}
                                addDisabled={loading}
                                addStatusText={loading ? 'Восстанавливаем сессию. Добавление персонажей скоро станет доступно.' : undefined}
                                onAdd={actions.handleAddCharacter}
                            />
                        </div>

                        <List
                            activeCharacter={activeCharacter}
                            openEditModal={() =>
                                modals.setEditingCharacter(activeCharacter)
                            }
                            addHits={actions.addHits}
                            subtractHits={actions.subtractHits}
                            subtractDice={actions.subtractDice}
                            longRest={actions.longRest}
                            isNoteOpen={notes.isNoteOpen}
                            toggleNoteOpen={() =>
                                notes.setIsNoteOpen(p => !p)
                            }
                            updateCharacter={actions.saveCharacter}
                            deleteNote={actions.requestDeleteNote}
                            reorderNotes={actions.reorderNotes}
                            notes={notes.normalizedNotes}
                            setActiveNote={notes.setActiveNoteId}
                            activeNoteId={notes.activeNoteId}
                        />
                    </div>
                )}
            </div>

            <Modal isOpen={modals.numberModal.isOpen} size="small">
                <ChangeHitsModal
                    title={modals.numberModal.title}
                    min={modals.numberModal.min}
                    max={modals.numberModal.max}
                    onConfirm={(value) =>
                        modals.numberModal.onConfirm?.(value)
                    }
                    onClose={modals.numberModal.closeModal}
                />
            </Modal>

            {modals.creatingCharacter && (
                <Modal isOpen size="small">
                    <CharacterModal
                        key="new-character"
                        character={null}
                        disabled={loading}
                        onClose={() =>
                            modals.setCreatingCharacter(false)
                        }
                        onSave={addCharacter}
                    />
                </Modal>
            )}

            {modals.editingCharacter && (
                <Modal isOpen size="small">
                    <CharacterModal
                        key={modals.editingCharacter.id}
                        character={modals.editingCharacter}
                        disabled={loading}
                        onClose={modals.closeEditModal}
                        onDelete={() => {
                            modals.setDeletingCharacter(modals.editingCharacter);
                            modals.closeEditModal();
                        }}
                        onSave={actions.saveCharacter}
                    />
                </Modal>
            )}

            {notes.deleteNoteId !== null && (
                <Modal isOpen size="small">
                    <Delete
                        name={deletingNoteTitle}
                        onClose={() =>
                            notes.setDeleteNoteId(null)
                        }
                        remove={notes.confirmDeleteNote}
                    />
                </Modal>
            )}

            {modals.deletingCharacter && (
                <Modal isOpen size="small">
                    <Delete
                        name={modals.deletingCharacter.name}
                        onClose={modals.closeDeleteModal}
                        remove={() =>
                            actions.handleRemoveCharacter(
                                modals.deletingCharacter!.id
                            )
                        }
                    />
                </Modal>
            )}
        </div>
    );
}
