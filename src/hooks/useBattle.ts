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
    setCards: React.Dispatch<React.SetStateAction<Card[]>>,
    openNumberModal: (params: {
        title: string;
        name?: string;
        min?: number;
        max?: number;
        onConfirm: (value: number) => void;
    }) => void
) => {
    const [battleCards, setBattleCards] = useState<BattleCard[]>([]);
    const [isBattle, setIsBattle] = useState(false);

    const [turnState, setTurnState] = useState({
        turnCounter: 0,
        currentTurnIndex: 0,
        round: 0,
        timer: 0
    });

    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [noteDraft, setNoteDraft] = useState('');

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

    const rollInitiative = (card: Card): Promise<number> => {
        return new Promise((resolve) => {
            if (!card.isPlayer) {
                const roll = Math.floor(Math.random() * 20 + 1);
                resolve(roll + (card.initiativeBonus || 0));
                return;
            }

            openNumberModal({
                title: `Введите инициативу для ${card.name}`,
                min: 0,
                max: 1000,
                onConfirm: (value) => {
                    const initiative = Math.max(0, Math.min(1000, value));
                    resolve(initiative);
                }
            });
        });
    };

    const startFight = async () => {
        if (battleCards.length === 0) return;

        const newBattleCards: BattleCard[] = [];

        for (const card of battleCards) {
            if (card.isPlayer) {
                const initiative = await rollInitiative(card); // ждём пока игрок введёт
                newBattleCards.push({ ...card, initiative });
            } else {
                const roll = Math.floor(Math.random() * 20 + 1);
                newBattleCards.push({ ...card, initiative: roll + (card.initiativeBonus || 0) });
            }
        }

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

        setBattleCards(prev => {
            const expired: string[] = [];

            const updated = prev.map(card => {
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
                setExpiredConditions(prevMsgs => [
                    ...prevMsgs,
                    ...expired.filter(msg => !prevMsgs.includes(msg))
                ]);
            }

            return updated;
        });

        setTurnState(prev => ({
            turnCounter: newTurn,
            currentTurnIndex: currentCardIndex,
            round: Math.floor(newTurn / totalCards) + 1,
            timer: prev.timer + turnDuration
        }));
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

            syncBattleHitsToCards(updated);

            if (updated.length <= 1) {
                setIsBattle(false);
                setTurnState({ turnCounter: 0, currentTurnIndex: 0, round: 0, timer: 0 });
                return [];
            }

            return updated;
        });
    };

    const subtractHits = (id: string) => {
        const card = battleCards.find(c => c.id === id);
        if (!card) return;

        openNumberModal({
            title: `Нанести урон ${card.name}`,
            min: 0,
            max: 1000,
            onConfirm: (damage) => {
                if (damage <= 0) return;

                let shouldRemove = false;

                setBattleCards(prev => {
                    const updated = prev.map(c => {
                        if (c.id !== id) return c;

                        const newHits = Math.max(0, c.currentHits - damage);

                        if (newHits === 0) {
                            shouldRemove = true;
                        }

                        return { ...c, currentHits: newHits };
                    });

                    return updated;
                });

                if (shouldRemove) {
                    getOutOfBattle(id);
                }
            }
        });
    };

    const addHits = (id: string) => {
        const card = battleCards.find(c => c.id === id);
        if (!card) return;

        openNumberModal({
            title: `Лечение ${card.name}`,
            min: 0,
            max: 1000,
            onConfirm: (heal) => {
                if (heal <= 0) return;

                setBattleCards(prev =>
                    prev.map(c =>
                        c.id === id
                            ? { ...c, currentHits: Math.max(0, c.currentHits + heal) }
                            : c
                    )
                );
            }
        });
    };

    const longRest = () => {
        setCards(prev =>
            prev.map(card =>
                card.currentHits > 0 ? { ...card, currentHits: card.maxHits } : card
            )
        );

        setBattleCards(prev =>
            prev.map(card =>
                card.currentHits > 0 ? { ...card, currentHits: card.maxHits } : card
            )
        );
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