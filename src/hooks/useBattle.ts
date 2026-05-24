import React, {useCallback, useEffect, useReducer, useState} from "react";
import type { Condition } from '../types/dnd.ts';
import type {Card} from "../types/CardInBattleTracker.ts";

export interface BattleCard extends Card {
    initiative: number;
    conditions?: Condition[];
}

export interface BattleHistoryEntry {
    id: string;
    round: number;
    turn: number;
    actorId: string;
    actorName: string;
    actions: string[];
}

type TurnState = {
    turnCounter: number;
    currentTurnIndex: number;
    round: number;
    timer: number;
};

type BattleState = {
    battleCards: BattleCard[];
    isBattle: boolean;
    turnState: TurnState;
    expiredConditions: string[];
    history: BattleHistoryEntry[];
};

const initialTurnState: TurnState = {
    turnCounter: 0,
    currentTurnIndex: 0,
    round: 0,
    timer: 0
};

const initialBattleState: BattleState = {
    battleCards: [],
    isBattle: false,
    turnState: initialTurnState,
    expiredConditions: [],
    history: []
};

type BattleAction =
    | { type: 'reset' }
    | { type: 'setBattleCards'; value: React.SetStateAction<BattleCard[]> }
    | { type: 'setIsBattle'; value: React.SetStateAction<boolean> }
    | { type: 'setTurnState'; value: React.SetStateAction<TurnState> }
    | { type: 'setExpiredConditions'; value: React.SetStateAction<string[]> }
    | { type: 'setHistory'; value: React.SetStateAction<BattleHistoryEntry[]> };

function resolveStateAction<T>(
    current: T,
    value: React.SetStateAction<T>
): T {
    return typeof value === 'function'
        ? (value as (prevState: T) => T)(current)
        : value;
}

function battleReducer(state: BattleState, action: BattleAction): BattleState {
    switch (action.type) {
        case 'reset':
            return initialBattleState;
        case 'setBattleCards':
            return {
                ...state,
                battleCards: resolveStateAction(state.battleCards, action.value)
            };
        case 'setIsBattle':
            return {
                ...state,
                isBattle: resolveStateAction(state.isBattle, action.value)
            };
        case 'setTurnState':
            return {
                ...state,
                turnState: resolveStateAction(state.turnState, action.value)
            };
        case 'setExpiredConditions':
            return {
                ...state,
                expiredConditions: resolveStateAction(state.expiredConditions, action.value)
            };
        case 'setHistory':
            return {
                ...state,
                history: resolveStateAction(state.history, action.value)
            };
        default:
            return state;
    }
}

function createHistoryEntry(card: BattleCard, round: number, turn: number): BattleHistoryEntry {
    return {
        id: crypto.randomUUID(),
        round,
        turn,
        actorId: card.id,
        actorName: card.name,
        actions: []
    };
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
    const [battleState, dispatch] = useReducer(battleReducer, initialBattleState);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [noteDraft, setNoteDraft] = useState('');
    const {
        battleCards,
        isBattle,
        turnState,
        expiredConditions,
        history
    } = battleState;

    const setBattleCards = useCallback((value: React.SetStateAction<BattleCard[]>) => {
        dispatch({ type: 'setBattleCards', value });
    }, []);

    const setIsBattle = useCallback((value: React.SetStateAction<boolean>) => {
        dispatch({ type: 'setIsBattle', value });
    }, []);

    const setTurnState = useCallback((value: React.SetStateAction<TurnState>) => {
        dispatch({ type: 'setTurnState', value });
    }, []);

    const setExpiredConditions = useCallback((value: React.SetStateAction<string[]>) => {
        dispatch({ type: 'setExpiredConditions', value });
    }, []);

    const setHistory = useCallback((value: React.SetStateAction<BattleHistoryEntry[]>) => {
        dispatch({ type: 'setHistory', value });
    }, []);

    const appendHistoryAction = useCallback((action: string) => {
        setHistory(prev => {
            const lastEntry = prev[prev.length - 1];

            if (!lastEntry) {
                return prev;
            }

            return [
                ...prev.slice(0, -1),
                {
                    ...lastEntry,
                    actions: [...lastEntry.actions, action]
                }
            ];
        });
    }, [setHistory]);

    const getCurrentActorName = useCallback(() => {
        return battleCards[turnState.currentTurnIndex]?.name ?? 'Мастер';
    }, [battleCards, turnState.currentTurnIndex]);

    // 🔥 СБРОС ПРИ СМЕНЕ ИГРЫ
    useEffect(() => {
        dispatch({ type: 'reset' });
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

    const syncBattleHitsToCards = useCallback((battleList: BattleCard[]) => {
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
    }, [setCards]);

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
        setHistory(
            newBattleCards.length > 0
                ? [createHistoryEntry(newBattleCards[0], 1, 1)]
                : []
        );
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
        setHistory([]);
    };

    const nextMove = () => {
        if (battleCards.length === 0) return;

        const totalCards = battleCards.length;
        const newTurn = turnState.turnCounter + 1;
        const currentCardIndex = (turnState.currentTurnIndex + 1) % totalCards;
        const currentCard = battleCards[currentCardIndex];
        const isNewRound = currentCardIndex === 0;
        const nextRound = isNewRound ? turnState.round + 1 : turnState.round;

        const SECONDS = 6;
        const isTurnMode = turnMode === 'turn';

        setHistory(prev => {
            const finalized = prev.map((entry, index) => {
                if (index !== prev.length - 1 || entry.actions.length > 0) {
                    return entry;
                }

                return {
                    ...entry,
                    actions: ['без активных действий']
                };
            });

            return [
                ...finalized,
                createHistoryEntry(currentCard, nextRound, newTurn + 1)
            ];
        });

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

    const addUserToBattle = async (card: Card) => {
        if (battleCards.some(c => c.id === card.id) || card.currentHits <= 0) return;

        const initiative = isBattle ? await rollInitiative(card) : 0;
        const currentCardId = battleCards[turnState.currentTurnIndex]?.id;

        setBattleCards(prev => {
            const updated = [
                ...prev,
                { ...card, initiative }
            ].sort((a, b) => b.initiative - a.initiative);

            if (isBattle && currentCardId) {
                const nextCurrentTurnIndex = updated.findIndex(item => item.id === currentCardId);

                if (nextCurrentTurnIndex >= 0) {
                    setTurnState(prevTurnState => ({
                        ...prevTurnState,
                        currentTurnIndex: nextCurrentTurnIndex
                    }));
                }
            }

            return updated;
        });

        if (isBattle) {
            appendHistoryAction(`${card.name} добавлен в бой с инициативой ${initiative}`);
        }
    };

    const getOutOfBattle = (id: string) => {
        const card = battleCards.find(c => c.id === id);

        if (card && isBattle) {
            appendHistoryAction(`${card.name} выведен из боя`);
        }

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
                setHistory([]);
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

                const sourceName = getCurrentActorName();
                const targetName = card.name;
                const willDie = card.currentHits - damage <= 0;

                appendHistoryAction(
                    `${sourceName} нанес ${damage} урона ${targetName}${willDie ? ', цель выбыла из боя' : ''}`
                );

                setBattleCards(prev => {
                    const damagedCards = prev.map(c =>
                        c.id === id
                            ? {
                                ...c,
                                currentHits: Math.max(0, c.currentHits - damage),
                                isDead: c.currentHits - damage <= 0
                            }
                            : c
                    );

                    syncBattleHitsToCards(damagedCards);

                    if (!willDie) {
                        return damagedCards;
                    }

                    const aliveCards = damagedCards.filter(c => c.currentHits > 0);

                    if (aliveCards.length <= 1) {
                        setIsBattle(false);
                        setTurnState({
                            turnCounter: 0,
                            currentTurnIndex: 0,
                            round: 0,
                            timer: 0
                        });
                        setExpiredConditions([]);
                        setHistory([]);

                        return [];
                    }

                    setTurnState(prevTurnState => {
                        const currentCard = damagedCards[prevTurnState.currentTurnIndex];
                        const currentCardIndex = currentCard
                            ? aliveCards.findIndex(aliveCard => aliveCard.id === currentCard.id)
                            : -1;

                        return {
                            ...prevTurnState,
                            currentTurnIndex: currentCardIndex >= 0
                                ? currentCardIndex
                                : Math.min(prevTurnState.currentTurnIndex, aliveCards.length - 1)
                        };
                    });

                    return aliveCards;
                });
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

                appendHistoryAction(`${getCurrentActorName()} восстановил ${heal} хитов ${card.name}`);

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
        const target = battleCards.find(card => card.id === cardId);

        if (target) {
            appendHistoryAction(`${getCurrentActorName()} применил состояние "${condition.label}" на ${target.name}`);
        }

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
            expiredConditions,
            history
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
