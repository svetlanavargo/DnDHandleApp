import { useEffect, useRef } from 'react';
import type { Card } from '../../../types/CardInBattleTracker.ts';
import type { Condition } from '../../../hooks/useBattle.ts';
import CardItem from '../Card/CardItem.tsx';
import styles from './BattleField.module.css';

export interface BattleCard extends Card {
    initiative: number;
    currentHits: number;
    conditions?: Condition[]
}

interface BattleProps {
    isBattle: boolean
    countCards: number,
    cards: BattleCard[],
    getOutOfBattle: (id: string) => void;
    nextMove: () => void;
    currentTurnIndex: number,
    addHits: (id: string) => void;
    subtractHits: (id: string) => void;
    addCondition: (id: string) => void;
    editingNoteId?: string | null;
    noteDraft?: string;

    startEditNote?: (id: string, note: string) => void;
    changeNoteDraft?: (value: string) => void;
    saveNote?: (id: string) => void;
}

function BattleField(
    {
        isBattle,
        cards,
        getOutOfBattle,
        currentTurnIndex,
        addHits,
        subtractHits,
        nextMove,
        addCondition,
        editingNoteId,
        noteDraft,
        startEditNote,
        changeNoteDraft,
        saveNote
    }: BattleProps) {
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!isBattle) return;
        const currentCard = cardRefs.current[currentTurnIndex];
        currentCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [currentTurnIndex, isBattle]);

    return (
        <div className={styles.battleField}>
            <div className={styles.battleCardsWrapper}>
                {cards.map((card, index) => (
                    <CardItem
                        key={card.id}
                        card={card}
                        isBattle={isBattle}
                        mode="battle"
                        getOutOfBattle={getOutOfBattle}
                        isCurrentTurn={currentTurnIndex === index}
                        nextMove={nextMove}
                        subtractHits={subtractHits}
                        addHits={addHits}
                        addCondition={addCondition}
                        ref={(el) => { cardRefs.current[index] = el }}
                        editingNoteId={editingNoteId}
                        noteDraft={noteDraft}
                        startEditNote={startEditNote}
                        changeNoteDraft={changeNoteDraft}
                        saveNote={saveNote}

                    />
                ))}
            </div>
        </div>
    )
}

export default BattleField