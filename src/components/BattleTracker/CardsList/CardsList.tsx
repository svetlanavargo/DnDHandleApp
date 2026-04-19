import { memo, useCallback, useMemo, useState } from 'react';
import type { Card } from '../../../types/CardInBattleTracker.ts';
import CardItem from '../Card/CardItem.tsx';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './CardsList.module.css';

interface BattleCard extends Card {
    initiative: number;
}

interface MainProps {
    cards: Card[];
    battleCards: BattleCard[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onCopy: (id: string) => void;
    isBattle: boolean;
    addUserToBattle: (id: string) => void;
    resurrectCard: (id: string) => void;
    onAddCard: () => void;
    onLongRest: () => void;

    isOpen: boolean;
    onClose: () => void;
}

function CardsList({
                       cards,
                       battleCards,
                       onEdit,
                       onDelete,
                       onCopy,
                       isBattle,
                       addUserToBattle,
                       resurrectCard,
                       onLongRest,
                       onAddCard,
                       isOpen,
                       onClose
                   }: MainProps) {
    const [activeTab, setActiveTab] = useState<'alive' | 'dead'>('alive');

    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const activeIds = useMemo(() => new Set(battleCards.map(card => card.id)), [battleCards]);
    const availableCards = useMemo(
        () => cards.filter(card => !activeIds.has(card.id)),
        [cards, activeIds]
    );
    const aliveCards = useMemo(
        () => availableCards.filter(card => card.currentHits > 0),
        [availableCards]
    );
    const deadCards = useMemo(
        () => availableCards.filter(card => card.currentHits <= 0),
        [availableCards]
    );

    const hasInjuredAliveCards = useMemo(
        () => aliveCards.some(card => card.currentHits < card.maxHits),
        [aliveCards]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX === null) return;

        const diff = e.changedTouches[0].clientX - touchStartX;

        // свайп влево → закрыть
        if (diff < -50) {
            onClose();
        }

        setTouchStartX(null);
    }, [touchStartX, onClose]);

    const renderCards = useCallback((cardsToRender: Card[]) => (
        <div className={styles.cardsWrapper}>
            {cardsToRender.map(card => (
                <CardItem
                    key={card.id}
                    card={card}
                    mode="list"
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onCopy={onCopy}
                    isBattle={isBattle}
                    addUserToBattle={addUserToBattle}
                    resurrectCard={resurrectCard}
                />
            ))}
        </div>
    ), [onEdit, onDelete, onCopy, isBattle, addUserToBattle, resurrectCard]);

    return (
        <>
            {/* overlay */}
            {isOpen && (
                <div className={styles.overlay} onClick={onClose} />
            )}

            <div
                className={`${styles.cardsList} ${isOpen ? styles.open : ''}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className={styles.actions}>
                    <div className={styles.closeWrapper}>
                        <Btn onClick={onClose} classBtn="close" />
                    </div>
                    <div className={styles.flex}>
                        {hasInjuredAliveCards && (
                            <Btn onClick={onLongRest} classBtn="reset" />
                        )}
                        <Btn onClick={onAddCard} classBtn="addCard" />
                    </div>
                </div>

                {cards.length > 0 && (
                    <>
                        <div className={styles.tabs}>
                            <div
                                className={`${styles.alive} ${activeTab === 'alive' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('alive')}
                            />
                            <div
                                className={`${styles.dead} ${activeTab === 'dead' ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab('dead')}
                            />
                        </div>

                        {activeTab === 'alive' && renderCards(aliveCards)}
                        {activeTab === 'dead' && renderCards(deadCards)}
                    </>
                )}
            </div>
        </>
    );
}

export default memo(CardsList);
