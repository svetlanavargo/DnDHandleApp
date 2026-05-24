import { memo, useEffect, useMemo, useRef } from 'react';
import type { BattleCard, BattleHistoryEntry } from '../../../hooks/useBattle.ts';
import ConditionsList from '../../UI/ConditionsList/ConditionsList.tsx';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './Times.module.css';

interface TimesProps {
    isBattle: boolean,
    timer: number,
    round: number,
    turnCounter: number,
    stopBattle: () => void
    battleCards?: BattleCard[],
    expiredConditions?: string[],
    history?: BattleHistoryEntry[],
    startFight: () => void,
    nextMove: () => void,
    onOpenSettings: () => void;
    listOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Times({isBattle, round, timer, turnCounter, startFight, nextMove, stopBattle, battleCards, expiredConditions, history, onOpenSettings, listOpen }: TimesProps) {
    const historyPanelRef = useRef<HTMLDivElement | null>(null);

    const formattedTime = useMemo(() => {
        const totalSeconds = Math.floor(timer);

        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;

        const formattedMin = String(min).padStart(2, '0');
        const formattedSec = String(sec).padStart(2, '0');

        return `${formattedMin}:${formattedSec}`;
    }, [timer]);

    const visibleHistory = useMemo(
        () => history?.filter(entry => entry.actions.length > 0) ?? [],
        [history]
    );

    useEffect(() => {
        const historyPanel = historyPanelRef.current;
        if (!historyPanel) return;

        historyPanel.scrollTop = historyPanel.scrollHeight;
    }, [visibleHistory]);

    return (
        <div className={styles.times}>
            <div className={styles.settings}>
                <div className={styles.btnFlex}>
                    <div className={styles.listBtn}>
                        <Btn
                            onClick={() => listOpen(true)}
                            classBtn="openCardList"
                        />
                    </div>
                    <Btn
                        onClick={onOpenSettings}
                        classBtn="settings"
                        disabled={isBattle}
                    />
                    {isBattle && (
                        <Btn onClick={stopBattle} classBtn='stopBattle'/>
                    )}
                    {isBattle && (
                        <Btn onClick={nextMove} classBtn='nextMove'/>
                    )}
                </div>
            </div>
            {
                isBattle ? (
                    <div className={styles.timersFlex}>
                        <div>
                            <div className={styles.baseTimers}>
                                <h3 className={styles.subtitle}>Общие таймеры:</h3>
                                <p><b>Всего ходов:</b> {turnCounter}</p>
                                <p><b>Таймер:</b> {formattedTime}</p>
                                <p><b>Раунд:</b> {round}</p>
                            </div>
                            <div className={styles.conditionsWrapper}>
                                <h3 className={styles.subtitle}>Состояния:</h3>
                                <div className={styles.conditionsPanel}>
                                    {battleCards?.map(card =>
                                            card.conditions && card.conditions.length > 0 && (
                                                <div key={card.id} className={styles.cardConditions}>
                                                    <b>{card.name}:</b>
                                                    <ConditionsList conditions={'conditions' in card ? card.conditions : undefined} />
                                                </div>
                                            )
                                    )}
                                </div>
                                <div className={styles.expiredNotices}>
                                    {expiredConditions?.map((msg, i) => (
                                        <p key={i}>{msg}</p>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.historyWrapper}>
                                <h3 className={styles.subtitle}>История:</h3>
                                <div ref={historyPanelRef} className={styles.historyPanel}>
                                    {visibleHistory.length > 0 ? (
                                        visibleHistory
                                            .map(entry => (
                                                <div key={entry.id} className={styles.historyEntry}>
                                                    <p className={styles.historyMeta}>
                                                        Раунд {entry.round}, ход {entry.turn}: {entry.actorName}
                                                    </p>
                                                    <ul className={styles.historyActions}>
                                                        {entry.actions.map((action, index) => (
                                                            <li key={`${entry.id}-${index}`}>{action}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))
                                    ) : (
                                        <p className={styles.historyEmpty}>Событий пока нет</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.startBattleBtn}>
                        {battleCards && battleCards.length > 1 && (
                            <Btn onClick={startFight} classBtn='startBattle'/>
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default memo(Times)
