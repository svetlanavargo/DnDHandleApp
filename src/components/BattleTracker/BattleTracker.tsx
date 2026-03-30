import { useState, useEffect } from "react";
import { useBattle } from '../../hooks/useBattle.ts';
import { useGame } from "../../context/GameProvider";
import { useNumberModal } from '../../hooks/useNumberModal.ts';
import type { CreateCondition } from '../../hooks/useBattle';
import type { Card } from '../../types/CardInBattleTracker.ts';

import NoGames from '../Stubs/NoGames/NoGames.tsx';

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

function BattleTracker() {
    const {
        currentGame,
        setCards,
        games,
        setTurnTimeMode,
        setCurrentGame,
        createGame,
        deleteGame
    } = useGame();

    const turnMode = currentGame?.turnTimeMode ?? 'turn';

    const cards = currentGame?.cards || [];

    const numberModal = useNumberModal();

    const {
        isBattle,
        battleCards,
        turnState,
        expiredConditions,

        editingNoteId,
        noteDraft,
        startEditNote,
        saveNote,
        setNoteDraft,

        startFight,
        stopBattle,
        nextMove,
        addUserToBattle,
        getOutOfBattle,
        subtractHits,
        addHits,
        longRest,
        addCondition,
        clearExpiredConditions,
        resurrectCard
    } = useBattle(
        currentGame?.id || null,
        cards,
        turnMode,
        setCards,
        numberModal.openModal,
    );

    const { turnCounter, timer, round, currentTurnIndex } = turnState;

    const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [deleteGameModalOpen, setDeleteGameModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [conditionModalOpen, setConditionModalOpen] = useState(false);
    const [currentCardForCondition, setCurrentCardForCondition] = useState<string | null>(null);

    // 🔥 СБРОС БОЯ ПРИ СМЕНЕ ИГРЫ (доп. защита)
    useEffect(() => {
        stopBattle();
    }, [currentGame?.id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => { setIsModalOpen(false); setEditingCardId(null); };

    const openConditionModal = (cardId: string) => {
        setCurrentCardForCondition(cardId);
        setConditionModalOpen(true);
    };

    const openDeleteGameModal = () => {
        if (!currentGame) return;
        setDeleteGameModalOpen(true);
    };

    const handleDeleteGame = () => {
        if (!currentGame) return;

        deleteGame(currentGame.id);
        setDeleteGameModalOpen(false);
        setIsSettingsOpen(false);
    };

    const openSettingsModal = () => {
        if (!currentGame) return;
        setIsSettingsOpen(true);
    };

    const closeConditionModal = () => {
        setCurrentCardForCondition(null);
        setConditionModalOpen(false);
    };

    const handleAddCondition = (cond: CreateCondition, targetIds: string[]) => {
        if (!currentCardForCondition) return;

        const sourceId = currentCardForCondition;

        const finalTargets =
            targetIds.length > 0
                ? targetIds
                : [sourceId];

        finalTargets.forEach(id => {
            const remaining =
                cond.type === 'time'
                    ? cond.duration * 10
                    : cond.duration;

            addCondition(id, {
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
                    card.id === editingCardId ? { ...card, ...data } : card
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

    const handleEdit = (id: string) => {
        setEditingCardId(id);
        setIsModalOpen(true);
    };

    const handleAddUserToBattle = (id: string) => {
        const card = cards.find(c => c.id === id);
        if (card) addUserToBattle(card);
    };

    const editingCard = cards.find(c => c.id === editingCardId);

    return (
        <div className={styles.battleTrackerContainer}>
            {games.length === 0 ?
                (<NoGames onAdd={() => setIsCreateGameOpen(true)}/>)
                :
                (
                <div className={styles.content}>
                    <Tabs
                        items={games.map(game => ({
                            id: game.id,
                            label: game.name
                        }))}
                        activeId={currentGame?.id || ''}
                        setActive={setCurrentGame}
                        onAdd={() => setIsCreateGameOpen(true)}
                    />
                    <div className={styles.container}>
                        <Times
                            isBattle={isBattle}
                            turnCounter={turnCounter}
                            timer={timer}
                            round={round}
                            stopBattle={stopBattle}
                            battleCards={battleCards}
                            expiredConditions={expiredConditions}
                            startFight={startFight}
                            nextMove={nextMove}
                            onOpenSettings={openSettingsModal}
                        />

                        <BattleField
                            isBattle={isBattle}
                            countCards={cards.length}
                            cards={battleCards}
                            getOutOfBattle={getOutOfBattle}
                            currentTurnIndex={currentTurnIndex}
                            nextMove={nextMove}
                            addHits={addHits}
                            subtractHits={subtractHits}
                            addCondition={openConditionModal}
                            editingNoteId={editingNoteId}
                            noteDraft={noteDraft}
                            startEditNote={startEditNote}
                            changeNoteDraft={setNoteDraft}
                            saveNote={saveNote}
                        />

                        <CardsList
                            cards={cards}
                            battleCards={battleCards}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isBattle={isBattle}
                            addUserToBattle={handleAddUserToBattle}
                            resurrectCard={resurrectCard}
                            onAddCard={openModal}
                            onLongRest={longRest}
                        />
                    </div>
                </div>
                )
            }

            {/* Modals */}
            {isSettingsOpen && currentGame && (
                <Modal isOpen size="small">
                    <GameSettings
                        game={currentGame}
                        onClose={() => setIsSettingsOpen(false)}
                        onOpenDeleteGame={openDeleteGameModal}
                        onChangeMode={setTurnTimeMode}
                    />
                </Modal>
            )}
            {isCreateGameOpen && (
                <Modal isOpen size="small">
                    <CreateGame
                        onCreate={createGame}
                        onClose={() => setIsCreateGameOpen(false)}
                    />
                </Modal>
            )}

            {isModalOpen && (
                <Modal isOpen size="small">
                    <CreateCardModal
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
                        cards={battleCards}
                    />
                </Modal>
            )}

            {expiredConditions.length > 0 && (
                <Modal isOpen size="small">
                    <NoticesModal
                        message={expiredConditions}
                        onClose={clearExpiredConditions}
                    />
                </Modal>
            )}

            <Modal isOpen={numberModal.isOpen} size="small">
                {numberModal.isOpen && numberModal.onConfirm && (
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