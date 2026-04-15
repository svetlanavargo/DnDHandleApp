import React, {useEffect, useState} from "react";
import type { Condition } from '../types/dnd.ts';
import type {Card} from "../types/CardInBattleTracker.ts";

export interface BattleCard extends Card {
    initiative: number;
    conditions?: Condition[];
}

export const useBattle = (
    gameId: string | null,
    _cards: Card[],
    turnMode: 'turn' | 'round',
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

    // 🔥 СБРОС ПРИ СМЕНЕ ИГРЫ
    useEffect(() => {
        setBattleCards([]);
        setIsBattle(false);
        setTurnState({
            turnCounter: 0,
            currentTurnIndex: 0,
            round: 0,
            timer: 0
        });
        setExpiredConditions([]);
    }, [gameId]);

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
            const initiative = await rollInitiative(card);
            newBattleCards.push({ ...card, initiative });
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
        setTurnState({
            turnCounter: 0,
            currentTurnIndex: 0,
            round: 0,
            timer: 0
        });
        setExpiredConditions([]);
    };

    const nextMove = () => {
        if (battleCards.length === 0) return;

        const totalCards = battleCards.length;
        const newTurn = turnState.turnCounter + 1;
        const currentCardIndex = newTurn % totalCards;
        const currentCard = battleCards[currentCardIndex];

        const SECONDS = 6;
        const isTurnMode = turnMode === 'turn';

        setBattleCards(prev => {
            const expired: string[] = [];

            const updated = prev.map(card => {
                if (!card.conditions) return card;

                const remainingConditions = card.conditions
                    .map(cond => {
                        let newRemaining = cond.remaining;

                        // condition "round" тикает только на активной цели
                        if (cond.type === 'round' && cond.sourceId === currentCard.id) {
                            newRemaining -= 1;
                        }

                        // condition "time" тикает всегда
                        if (cond.type === 'time') {
                            newRemaining -= 1;
                        }

                        if (newRemaining <= 0) {
                            expired.push(`Состояние "${cond.label}" на ${card.name} закончилось`);
                            return null;
                        }

                        return { ...cond, remaining: newRemaining };
                    })
                    .filter(Boolean) as Condition[];

                return { ...card, conditions: remainingConditions };
            });

            if (expired.length > 0) {
                setExpiredConditions(prevMsgs =>
                    [...prevMsgs, ...expired.filter(msg => !prevMsgs.includes(msg))]
                );
            }

            return updated;
        });

        setTurnState(prev => {
            const isNewRound = currentCardIndex === 0;

            return {
                turnCounter: newTurn,
                currentTurnIndex: currentCardIndex,

                round: isNewRound ? prev.round + 1 : prev.round,

                // 🔥 ВОТ ТУТ ФИКС СМЫСЛА
                timer: prev.timer + (
                    isTurnMode
                        ? SECONDS              // turn = 6 сек за ход
                        : SECONDS / totalCards // round = 6 сек за круг
                )
            };
        });
    };

    const addUserToBattle = (card: Card) => {
        if (battleCards.some(c => c.id === card.id) || card.currentHits <= 0) return;

        setBattleCards(prev => [
            ...prev,
            { ...card, initiative: 0 }
        ]);
    };

    const getOutOfBattle = (id: string) => {
        setBattleCards(prev => {
            const updated = prev.filter(c => c.id !== id);

            // syncBattleHitsToCards(updated);

            if (updated.length <= 1) {
                setIsBattle(false);
                setTurnState({
                    turnCounter: 0,
                    currentTurnIndex: 0,
                    round: 0,
                    timer: 0
                });
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

                setBattleCards(prev =>
                    prev.map(c =>
                        c.id === id
                            ? {
                                ...c,
                                currentHits: Math.max(0, c.currentHits - damage),
                                isDead: c.currentHits - damage <= 0
                            }
                            : c
                    )
                );
            }
        });
    };

    useEffect(() => {
        const deadCards = battleCards.filter(c => c.currentHits === 0);
        if (deadCards.length === 0) return;

        syncBattleHitsToCards(battleCards);

        const timer = setTimeout(() => {
            // ✅ 2. ПОТОМ удаляем
            setBattleCards(prev => prev.filter(c => c.currentHits > 0));
        }, 300);

        return () => clearTimeout(timer);
    }, [battleCards]);

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
        state: {
            isBattle,
            battleCards,
            turnState,
            expiredConditions
        },

        notes: {
            editingNoteId,
            noteDraft,
            startEditNote,
            saveNote,
            setNoteDraft
        },

        actions: {
            startFight,
            stopBattle,
            nextMove,
            addUserToBattle,
            getOutOfBattle,
            subtractHits,
            addHits,
            longRest,
            addCondition,
            resurrectCard
        },

        utils: {
            clearExpiredConditions
        }
    };
};