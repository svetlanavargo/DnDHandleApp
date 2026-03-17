import React, { useState } from 'react';
import type { Card } from '../types/CardInBattleTracker.ts';

export type Condition = {
    id: string,
    name: string,
    duration: number,
    type: 'round' | 'time',
    remaining: number
}

export interface BattleCard extends Card {
    initiative: number;
    conditions?: Condition[];
}

export const useBattle = (
    _cards: Card[],
    setCards: React.Dispatch<React.SetStateAction<Card[]>>
) => {
    const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
    const [isBattle, setIsBattle] = useState(false);

    // счётчики ходов, раундов и таймер
    const [turnState, setTurnState] = useState({
        turnCounter: 0,
        currentTurnIndex: 0,
        round: 0,
        timer: 0
    });

    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [noteDraft, setNoteDraft] = useState('');

    // сообщения о завершении состояний
    const [expiredConditions, setExpiredConditions] = useState<string[]>([]);

    const turnDuration = 6;

    const startEditNote = (id: string, note: string) => {
        setEditingNoteId(id);
        setNoteDraft(note);
    };

    const saveNote = (id: string) => {
        setBattleCards(prev =>
            prev.map(card =>
                card.id === id ? { ...card, note: noteDraft } : card
            )
        );

        setEditingNoteId(null);
    };

    const syncBattleHitsToCards = (battleList: BattleCard[]) => {
        setCards(prevCards =>
            prevCards.map(card => {
                const battleCard = battleList.find(b => b.id === card.id);

                if (!battleCard) return card;

                return {
                    ...card,
                    currentHits: battleCard.currentHits,
                    note: battleCard.note
                };
            })
        );
    };

    const rollInitiative = (card: Card) => {
        if (card.isPlayer) {
            let value: number | null = null;

            while (value === null) {
                const input = window.prompt(`Инициатива ${card.name}:`, '0');
                if (input === null) return 0; // отмена

                const num = Number(input);

                if (!Number.isNaN(num)) {
                    value = num;
                } else {
                    alert('Введите число');
                }
            }

            return Math.max(0, Math.min(1000, value));
        }
        const roll = Math.floor(Math.random() * 20 + 1);
        return roll + (card.initiativeBonus || 0);
    };

    const startFight = () => {
        if (battleCards.length === 0) return;

        const newBattleCards = battleCards.map(card => ({
            ...card,
            initiative: rollInitiative(card)
        }));

        newBattleCards.sort((a, b) => b.initiative - a.initiative);

        setBattleCards(newBattleCards);
        setIsBattle(true);
        setTurnState({
            turnCounter: 0,
            currentTurnIndex: 0,
            round: 1,
            timer: 0
        });

        setExpiredConditions([]);
    };

    const stopBattle = () => {
        syncBattleHitsToCards(battleCards);

        setBattleCards([]);
        setIsBattle(false);
        setTurnState({ turnCounter: 0, currentTurnIndex: 0, round: 0, timer: 0 });
        setExpiredConditions([]);
    };

    const nextMove = () => {
        if (battleCards.length === 0) return;

        const totalCards = battleCards.length;
        const newTurn = turnState.turnCounter + 1;
        const currentCardIndex = newTurn % totalCards;
        const currentCard = battleCards[currentCardIndex];

        setBattleCards(prevCards => {
            const expired: string[] = [];

            const updated = prevCards.map(card => {
                if (!card.conditions) return card;

                const remainingConditions = card.conditions
                    .map(cond => {
                        let newRemaining = cond.remaining;

                        if (cond.type === 'round' && card.id === currentCard.id) newRemaining -= 1;
                        if (cond.type === 'time') newRemaining -= 1;

                        if (newRemaining <= 0) {
                            expired.push(`Состояние "${cond.name}" на ${card.name} закончилось`);
                            return null;
                        }
                        return { ...cond, remaining: newRemaining };
                    })
                    .filter(Boolean) as Condition[];

                return { ...card, conditions: remainingConditions };
            });

            if (expired.length > 0) {
                setExpiredConditions(prev => [...prev, ...expired.filter(msg => !prev.includes(msg))]);
            }

            return updated;
        });

        // обновляем счётчики отдельно
        setTurnState({
            turnCounter: newTurn,
            currentTurnIndex: currentCardIndex,
            round: Math.floor(newTurn / totalCards) + 1,
            timer: turnState.timer + turnDuration
        });
    };

    const addUserToBattle = (card: Card) => {
        if (battleCards.some(c => c.id === card.id) || card.currentHits <= 0) return;

        const newBattleCard: BattleCard = {
            ...card,
            initiative: 0
        };

        setBattleCards(prev => [...prev, newBattleCard]);
    };

    const getOutOfBattle = (id: string) => {
        setBattleCards(prev => {
            const updated = prev.filter(c => c.id !== id);

            // синхронизируем хиты
            syncBattleHitsToCards(prev);

            if (updated.length <= 1) {
                setIsBattle(false);
                setTurnState({ turnCounter: 0, currentTurnIndex: 0, round: 0, timer: 0 });
                return [];
            }

            return updated;
        });
    };

    const changeHits = (id: string, delta: number) => {
        setBattleCards(prev =>
            prev.map(card =>
                card.id === id ? { ...card, currentHits: Math.max(0, card.currentHits + delta) } : card
            )
        );
    };

    const subtractHits = (id: string) => {
        const card = battleCards.find(c => c.id === id);
        if (!card) return;

        const input = window.prompt(`Сколько урона у ${card.name}?`, '0');
        if (!input) return;

        const damage = Number(input);
        if (isNaN(damage)) return;

        const newHits = Math.max(0, card.currentHits - damage);

        setBattleCards(prev =>
            prev.map(c =>
                c.id === id ? { ...c, currentHits: newHits } : c
            )
        );

        if (newHits === 0) {
            getOutOfBattle(id);
        }
    };

    const addHits = (id: string) => {
        const input = window.prompt('Сколько лечения?');
        if (!input) return;

        const heal = Number(input);
        if (isNaN(heal)) return;

        changeHits(id, heal);
    };

    const longRest = () => {
        setCards(prev => prev.map(card => card.currentHits > 0 ? { ...card, currentHits: card.maxHits } : card));
        setBattleCards(prev => prev.map(card => card.currentHits > 0 ? { ...card, currentHits: card.maxHits } : card));
    };

    const addCondition = (cardId: string, condition: Condition) => {
        setBattleCards(prev =>
            prev.map(card =>
                card.id === cardId
                    ? {
                        ...card,
                        conditions: card.conditions
                            ? [...card.conditions.slice(0, 4), condition]
                            : [condition]
                    }
                    : card
            )
        );
    };

    const resurrectCard = (id: string) => {
        setCards(prev =>
            prev.map(card =>
                card.id === id ? { ...card, currentHits: card.maxHits } : card
            )
        );
    };

    const clearExpiredConditions = () => {
        setExpiredConditions([]);
    };

    return {
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
    };
};