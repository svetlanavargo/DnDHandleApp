import { useState } from 'react';
import { useBattle } from '../../hooks/useBattle.ts';
import { useGame } from '../../hooks/useGame.ts';
import { useNumberModal } from '../../hooks/useNumberModal.ts';
import { useAuth } from '../../context/auth/useAuth.ts';
import type { CreateCondition } from '../../types/dnd.ts';
import type { Card } from '../../types/CardInBattleTracker.ts';

import Warning from "../UI/Warning/Warning.tsx";
import EmptyState from '../UI/EmptyState/EmptyState.tsx';

import Tabs from '../UI/Tabs/Tabs.tsx';
import CardsList from './CardsList/CardsList.tsx';
import Times from './Times/Times.tsx';
import BattleField from './BattleField/BattleField.tsx';

import Modal from '../Modals/Modal.tsx';
import GameSettings from '../Modals/GameSettings.tsx';
import Delete from '../Modals/Delete.tsx';
import CreateGame from '../Modals/CreateGame.tsx';
import ChangeHitsModal from '../Modals/ChangeHitsModal.tsx';
import CreateCardModal from '../Modals/CreateCardModal.tsx';
import ConditionModal from '../Modals/ConditionModal.tsx';
import NoticesModal from '../Modals/NoticesModal.tsx';

import styles from './BattleTracker.module.css';

function getNextCopiedCardName(sourceName: string, existingNames: string[]) {
    const trimmedSourceName = sourceName.trim();
    const escapedName = trimmedSourceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = new RegExp(`^${escapedName}(?: (\\d+))?$`);

    const usedNumbers = existingNames.reduce<number[]>((result, currentName) => {
        const match = currentName.trim().match(namePattern);

        if (!match) {
            return result;
        }

        result.push(match[1] ? Number(match[1]) : 1);
        return result;
    }, []);

    let nextNumber = 2;

    while (usedNumbers.includes(nextNumber)) {
        nextNumber += 1;
    }

    return `${trimmedSourceName} ${nextNumber}`;
}

function BattleTracker() {
    const { loading, user } = useAuth();
    const {
        currentGame,
        setCards,
        games,
        setTurnTimeMode,
        setCurrentGame,
        createGame,
        deleteGame,
        renameGame
    } = useGame();

    const turnMode = currentGame?.turnTimeMode ?? 'turn';
    const cards = currentGame?.cards || [];

    const numberModal = useNumberModal();

    const battle = useBattle(
        currentGame?.id || null,
        cards,
        turnMode,
        setCards,
        numberModal.openModal
    );

    const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [deleteGameModalOpen, setDeleteGameModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [conditionModalOpen, setConditionModalOpen] = useState(false);
    const [currentCardForCondition, setCurrentCardForCondition] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCardId(null);
    };

    const openConditionModal = (cardId: string) => {
        setCurrentCardForCondition(cardId);
        setConditionModalOpen(true);
    };

    const closeConditionModal = () => {
        setCurrentCardForCondition(null);
        setConditionModalOpen(false);
    };

    const openDeleteGameModal = () => {
        if (!currentGame) return;
        setDeleteGameModalOpen(true);
    };

    const handleDeleteGame = () => {
        if (!currentGame) return;

        battle.actions.stopBattle();
        deleteGame(currentGame.id);

        setDeleteGameModalOpen(false);
        setIsSettingsOpen(false);
    };

    const openSettingsModal = () => {
        if (!currentGame) return;
        setIsSettingsOpen(true);
    };

    const handleAddCondition = (cond: CreateCondition, targetIds: string[]) => {
        if (!currentCardForCondition) return;

        const sourceId = currentCardForCondition;
        const finalTargets = targetIds.length > 0 ? targetIds : [sourceId];

        finalTargets.forEach(id => {
            const remaining =
                cond.type === 'time'
                    ? cond.duration * 10
                    : cond.duration;

            battle.actions.addCondition(id, {
                ...cond,
                remaining,
                sourceId
            });
        });
    };

    const handleSubmit = (data: Omit<Card, 'id'>) => {
        if (!currentGame) return;

        if (editingCardId) {
            setCards(prev =>
                prev.map(card =>
                    card.id === editingCardId
                        ? { ...card, ...data }
                        : card
                )
            );
        } else {
            const newCard = {
                id: Math.random().toString(36).substr(2, 9),
                ...data
            };

            setCards(prev => [...prev, newCard]);
        }

        closeModal();
    };

    const handleDelete = (id: string) =>
        setCards(prev => prev.filter(c => c.id !== id));

    const handleCopy = (id: string) => {
        const sourceCard = cards.find(card => card.id === id);

        if (!sourceCard) {
            return;
        }

        const copiedCard: Card = {
            ...sourceCard,
            id: crypto.randomUUID(),
            name: getNextCopiedCardName(
                sourceCard.name,
                cards.map(card => card.name)
            ),
        };

        setCards(prev => [...prev, copiedCard]);
    };

    const handleEdit = (id: string) => {
        setEditingCardId(id);
        setIsModalOpen(true);
    };

    const handleAddUserToBattle = (id: string) => {
        const card = cards.find(c => c.id === id);
        if (card) battle.actions.addUserToBattle(card);
    };

    const editingCard = cards.find(c => c.id === editingCardId);

    return (
        <div className={styles.battleTrackerContainer}>
            <div className={styles.pageShell}>
                {!user && (
                    <Warning />
                )}

                {games.length === 0 ? (
                    <EmptyState
                        image={<div className={styles.img} />}
                        title="Уважаемый мастер!"
                        text="Благодарим Вас за вашу работу! Для создания новой игры нажмите"
                        buttonText="Создать игру"
                        buttonDisabled={loading}
                        statusText={loading ? 'Восстанавливаем сессию. Создание игр временно недоступно.' : undefined}
                        onButtonClick={() => setIsCreateGameOpen(true)}
                    />
                ) : (
                    <div className={styles.content}>
                        <div className={styles.tabsShell}>
                            <Tabs
                                items={games.map(game => ({
                                    id: game.id,
                                    label: game.name
                                }))}
                                activeId={currentGame?.id || ''}
                                setActive={setCurrentGame}
                                addDisabled={loading}
                                addStatusText={loading ? 'Восстанавливаем сессию. Добавление игр скоро станет доступно.' : undefined}
                                onAdd={() => setIsCreateGameOpen(true)}
                            />
                        </div>

                        <div className={styles.container}>
                            <Times
                                isBattle={battle.state.isBattle}
                                turnCounter={battle.state.turnState.turnCounter}
                                timer={battle.state.turnState.timer}
                                round={battle.state.turnState.round}
                                stopBattle={battle.actions.stopBattle}
                                battleCards={battle.state.battleCards}
                                expiredConditions={battle.state.expiredConditions}
                                startFight={battle.actions.startFight}
                                nextMove={battle.actions.nextMove}
                                onOpenSettings={openSettingsModal}
                                listOpen={setIsOpen}
                            />

                            <BattleField
                                isBattle={battle.state.isBattle}
                                countCards={cards.length}
                                cards={battle.state.battleCards}
                                getOutOfBattle={battle.actions.getOutOfBattle}
                                currentTurnIndex={battle.state.turnState.currentTurnIndex}
                                nextMove={battle.actions.nextMove}
                                addHits={battle.actions.addHits}
                                subtractHits={battle.actions.subtractHits}
                                addCondition={openConditionModal}
                                editingNoteId={battle.notes.editingNoteId}
                                noteDraft={battle.notes.noteDraft}
                                startEditNote={battle.notes.startEditNote}
                                changeNoteDraft={battle.notes.setNoteDraft}
                                saveNote={battle.notes.saveNote}
                            />

                            <CardsList
                                cards={cards}
                                battleCards={battle.state.battleCards}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCopy={handleCopy}
                                isBattle={battle.state.isBattle}
                                addUserToBattle={handleAddUserToBattle}
                                resurrectCard={battle.actions.resurrectCard}
                                onAddCard={openModal}
                                onLongRest={battle.actions.longRest}
                                isOpen={isOpen}
                                onClose={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}

            {isSettingsOpen && currentGame && (
                <Modal isOpen size="small">
                    <GameSettings
                        game={currentGame}
                        onClose={() => setIsSettingsOpen(false)}
                        onOpenDeleteGame={openDeleteGameModal}
                        onChangeMode={setTurnTimeMode}
                        onRename={renameGame}
                    />
                </Modal>
            )}

            {isCreateGameOpen && (
                <Modal isOpen size="small">
                    <CreateGame
                        disabled={loading}
                        onCreate={createGame}
                        onClose={() => setIsCreateGameOpen(false)}
                    />
                </Modal>
            )}

            {isModalOpen && (
                <Modal isOpen size="small">
                    <CreateCardModal
                        key={editingCardId ?? 'new-card'}
                        initialValues={editingCard}
                        onSubmit={handleSubmit}
                        onClose={closeModal}
                    />
                </Modal>
            )}

            {deleteGameModalOpen && currentGame && (
                <Modal isOpen size="small">
                    <Delete
                        name={currentGame.name}
                        onClose={() => setDeleteGameModalOpen(false)}
                        remove={handleDeleteGame}
                    />
                </Modal>
            )}

            {conditionModalOpen && (
                <Modal isOpen size="small">
                    <ConditionModal
                        onAdd={handleAddCondition}
                        onClose={closeConditionModal}
                        cards={battle.state.battleCards}
                    />
                </Modal>
            )}

            {battle.state.expiredConditions.length > 0 && (
                <Modal isOpen size="small">
                    <NoticesModal
                        message={battle.state.expiredConditions}
                        onClose={battle.utils.clearExpiredConditions}
                    />
                </Modal>
            )}

            <Modal isOpen={numberModal.isOpen} size="small">
                {numberModal.onConfirm && (
                    <ChangeHitsModal
                        key={numberModal.modalKey}
                        title={numberModal.title}
                        min={numberModal.min}
                        max={numberModal.max}
                        onConfirm={numberModal.onConfirm}
                        onClose={numberModal.closeModal}
                    />
                )}
            </Modal>
        </div>
    );
}

export default BattleTracker;
