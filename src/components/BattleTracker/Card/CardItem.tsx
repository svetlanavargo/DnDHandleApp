import { useRef, useEffect, forwardRef } from 'react';
import type { Card } from '../../../types/CardInBattleTracker.ts';
import type { BattleCard } from '../BattleField/BattleField.tsx';
import ConditionsList from '../../UI/ConditionsList/ConditionsList.tsx';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './Card.module.css';

type CardMode = 'list' | 'battle';

interface CardProps {
    card: Card | BattleCard;
    mode: CardMode;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    isBattle: boolean;
    addUserToBattle?: (id: string) => void;
    getOutOfBattle?: (id: string) => void;
    nextMove?: () => void;
    isCurrentTurn?: boolean;
    addHits?: (id: string) => void;
    subtractHits?: (id: string) => void;
    addCondition?: (id: string) => void;
    resurrectCard?: (id: string) => void;
    editingNoteId?: string | null;
    noteDraft?: string;

    startEditNote?: (id: string, note: string) => void;
    changeNoteDraft?: (value: string) => void;
    saveNote?: (id: string) => void;
}

const CardItem = forwardRef<HTMLDivElement, CardProps>(({
                                                            card,
                                                            mode,
                                                            onEdit,
                                                            onDelete,
                                                            isCurrentTurn,
                                                            isBattle,
                                                            addUserToBattle,
                                                            getOutOfBattle,
                                                            nextMove,
                                                            addHits,
                                                            subtractHits,
                                                            addCondition,
                                                            resurrectCard,
                                                            editingNoteId,
                                                            noteDraft,
                                                            startEditNote,
                                                            changeNoteDraft,
                                                            saveNote
                                                        }, ref) => {
    const { id, name, maxHits, currentHits, ac, isPlayer, color, initiativeBonus, note } = card;
    const initiative = 'initiative' in card ? card.initiative : 0;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Проверяем, редактируется ли заметка
    const isEditingNote = editingNoteId === id;

    // Функция для автоизменения высоты textarea
    const adjustHeight = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    };

    // Автофокус и автоизменение высоты при редактировании заметки
    useEffect(() => {
        if (isEditingNote && textareaRef.current) {
            const el = textareaRef.current;
            el.focus();
            // ставим курсор в конец текста
            const length = el.value.length;
            el.setSelectionRange(length, length);
            adjustHeight(el);
        }
    }, [isEditingNote, noteDraft]);

    // Подстраиваем высоту, если изменился note (например, при загрузке данных)
    useEffect(() => {
        if (textareaRef.current) {
            adjustHeight(textareaRef.current);
        }
    }, [note]);

    let colorClass, hitsClass, isDead, deadClass, isNPC;

    if (isPlayer && color) {
        if (color === 'red') colorClass = styles.red;
        else if (color === 'blue') colorClass = styles.blue;
        else if (color === 'green') colorClass = styles.green;
    }

    if (Number(currentHits) <= maxHits / 2) hitsClass = styles.low;
    if (Number(currentHits) <= 0) isDead = true;
    if (isDead) deadClass = styles.dead
    if (!isPlayer) isNPC = styles.nps;

    return (
        <div
            ref={ref}
            className={`
                ${styles.card} 
                ${colorClass || ''} 
                ${hitsClass || ''} 
                ${deadClass || ''} 
               ${isBattle && isCurrentTurn ? styles.currentTurn : ''}
            `}
        >
            <div>
                <div className={styles.cardHeader}>
                    <div className={styles.flex}>
                        <div className={styles.shield}><b>{ac}</b></div>
                        <div className={isNPC}>
                            <h2 className={styles.cardName}>{name}</h2>
                        </div>
                    </div>

                    {mode === 'list' && (
                        <div className={styles.btns}>
                            <Btn onClick={() => onEdit?.(id)} classBtn='edit'/>
                            <Btn onClick={() => onDelete?.(id)} classBtn='delete'/>
                        </div>
                    )}

                    {mode === 'battle' && (
                        <div className={styles.initiative}>{initiative}</div>
                    )}
                </div>

                <div>
                    {mode === 'battle' ? (
                        <div className={styles.hitsWrapper}>
                            <Btn onClick={() => addHits?.(id)} classBtn='addHits'/>
                            <p className={styles.battleHits}><b>{currentHits}/{maxHits}</b></p>
                            <Btn onClick={() => subtractHits?.(id)} classBtn='subtractHits'/>
                        </div>
                    ) : (
                        <p className={styles.description}>Хиты: <b>{currentHits}/{maxHits}</b></p>
                    )}

                    {mode === 'battle' && (
                        <div className={styles.conditionWrap}>
                            {isBattle && isCurrentTurn && <Btn onClick={() => addCondition?.(id)} classBtn='addCondition' />}
                            <ConditionsList conditions={'conditions' in card ? card.conditions : undefined} />
                        </div>
                    )}

                    {initiativeBonus && mode === 'list' ? (
                        <p className={styles.description}>Бонус Инициативы: <b>{initiativeBonus}</b></p>
                    ) : null}

                    {mode === 'battle' ? (
                        <div className={styles.noteWrapper}>
                            {!isEditingNote ? (
                                <Btn
                                    onClick={() => startEditNote?.(id, note || '')}
                                    classBtn='note'
                                />
                            ) : (
                                <Btn
                                    onClick={() => saveNote?.(id)}
                                    classBtn='saveNote'
                                />
                            )}
                            <textarea
                                ref={textareaRef}
                                className={styles.noteTextarea}
                                value={isEditingNote ? noteDraft : note || ''}
                                disabled={!isEditingNote}
                                onChange={(e) => {
                                    changeNoteDraft?.(e.target.value);
                                    adjustHeight(e.target);
                                }}
                            />
                        </div>
                    ) : (
                        note && <p className={styles.note}>{note}</p>
                    )}
                </div>
            </div>

            <div>
                {mode === 'list' && currentHits > 0 && (
                    <div className={styles.addUserToBattleBtn}>
                        <Btn onClick={() => addUserToBattle?.(id)} classBtn='addUserToBattle'/>
                    </div>
                )}
                {mode === 'battle' &&(
                    <div className={styles.battleBtns}>
                        <Btn onClick={() => getOutOfBattle?.(id)} classBtn='getOutOfBattle'/>
                        {isCurrentTurn && isBattle &&  <Btn onClick={() => nextMove?.()} classBtn='nextMove'/>}
                    </div>
                )}
                {isDead && (
                    <div className={styles.resurrectionBtn}>
                        <Btn onClick={() => resurrectCard?.(id)} classBtn='resurrection'/>
                    </div>
                )}
            </div>
        </div>
    );
});

export default CardItem;