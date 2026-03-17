import {useEffect, useState} from "react";
import type { Card } from '../../types/CardInBattleTracker.ts';
import { useBattle } from '../../hooks/useBattle.ts';
import type { Condition } from '../../hooks/useBattle';
import CardsList from './CardsList/CardsList.tsx';
import Times from './Times/Times.tsx';
import BattleField from './BattleField/BattleField.tsx';
import CreateCardModal from '../Modals/CreateCardModal.tsx';
import ConditionModal from '../Modals/ConditionModal.tsx';
import NoticesModal from '../Modals/NoticesModal.tsx';
import styles from './BattleTracker.module.css';


function BattleTracker() {
    const [cards, setCards] = useState<Card[]>(() => {
        const saved = localStorage.getItem('cards');
        return saved ? JSON.parse(saved) : [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [conditionModalOpen, setConditionModalOpen] = useState(false);
    const [currentCardForCondition, setCurrentCardForCondition] = useState<string | null>(null);

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
    } = useBattle(cards, setCards);

    const { turnCounter, timer, round, currentTurnIndex } = turnState;

    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(cards));
    }, [cards]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => { setIsModalOpen(false); setEditingCardId(null); };

    const openConditionModal = (cardId: string) => {
        setCurrentCardForCondition(cardId);
        setConditionModalOpen(true);
    };
    const closeConditionModal = () => {
        setCurrentCardForCondition(null);
        setConditionModalOpen(false);
    };
    const handleAddCondition = (cond: Condition) => {
        if (!currentCardForCondition) return;

        const remaining = cond.type === 'time' ? cond.duration * 10 : cond.duration;

        addCondition(currentCardForCondition, { ...cond, remaining });
    };

    const handleSubmit = (data: Omit<Card, 'id'>) => {
        if (editingCardId) {
            setCards(prev =>
                prev.map(card => card.id === editingCardId ? { ...card, ...data } : card)
            );
        } else {
            const newCard: Card = { id: Math.random().toString(36).substr(2, 9), ...data };
            setCards(prev => [...prev, newCard]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => setCards(prev => prev.filter(c => c.id !== id));
    const handleEdit = (id: string) => { setEditingCardId(id); setIsModalOpen(true); };
    const handleAddUserToBattle = (id: string) => {
        const card = cards.find(c => c.id === id);
        if (card) addUserToBattle(card);
    };

    const editingCard = cards.find(c => c.id === editingCardId);

    return (
        <>
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

            <CreateCardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                initialValues={editingCard ? {
                    name: editingCard.name,
                    maxHits: editingCard.maxHits,
                    currentHits: editingCard.currentHits,
                    ac: editingCard.ac,
                    isPlayer: editingCard.isPlayer,
                    initiativeBonus: editingCard.initiativeBonus,
                    note: editingCard.note,
                    color: editingCard.color
                } : undefined}
            />

            <ConditionModal
                isOpen={conditionModalOpen}
                onClose={closeConditionModal}
                onAdd={handleAddCondition}
            />

            {expiredConditions.length > 0 && (
                <NoticesModal
                    message={expiredConditions}
                    onClose={clearExpiredConditions}
                />
            )}
        </>
    );
}

export default BattleTracker