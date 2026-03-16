import { useState } from 'react';
import type {Card} from '../../../App.tsx';
import CardItem from '../Card/CardItem.tsx';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './CardsList.module.css';

interface BattleCard extends Card {
    initiative: number
}

interface MainProps {
    cards: Card[],
    battleCards: BattleCard[]
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isBattle: boolean,
    addUserToBattle: (id: string) => void;
    resurrectCard: (id: string) => void;
    onAddCard: () => void;
    onLongRest: () => void;
}

function CardsList(
    {
        cards,
        battleCards,
        onEdit,
        onDelete,
        isBattle,
        addUserToBattle,
        resurrectCard,
        onLongRest,
        onAddCard
    }: MainProps) {
    const [activeTab, setActiveTab] = useState<'alive' | 'dead'>('alive')

    const activeIds = battleCards.map(card => card.id)
    const availableCards = cards.filter(card => !activeIds.includes(card.id))
    const aliveCards = availableCards.filter(card => card.currentHits > 0)
    const hasInjuredAliveCards = aliveCards.some(
        card => card.currentHits < card.maxHits
    )
    const deadCards = availableCards.filter(card => card.currentHits <= 0)

    const renderCards = (cardsToRender: Card[]) => (
        <div className={styles.cardsWrapper}>
            {cardsToRender.map(card => (
                <CardItem
                    key={card.id}
                    card={card}
                    mode="list"
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isBattle={isBattle}
                    addUserToBattle={addUserToBattle}
                    resurrectCard={resurrectCard}
                />
            ))}
        </div>
    );

    return (
        <div className={styles.cardsList}>
            {cards.length > 0 && (
                <>
                    <div className={styles.actions}>
                        {hasInjuredAliveCards && (
                            <Btn onClick={onLongRest} classBtn='reset'/>
                        )}
                        <Btn onClick={onAddCard} classBtn='addCard'/>
                    </div>
                    {/* Вкладки */}
                    <div className={styles.tabs}>
                        <div
                            className={`${styles.alive} ${activeTab === 'alive' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('alive')}
                        >
                        </div>
                        <div
                            className={`${styles.dead} ${activeTab === 'dead' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('dead')}
                        >
                        </div>
                    </div>

                    {/* Содержимое вкладки */}
                    {activeTab === 'alive' && renderCards(aliveCards)}
                    {activeTab === 'dead' && renderCards(deadCards)}
                </>
            )}
        </div>
    )
}

export default CardsList