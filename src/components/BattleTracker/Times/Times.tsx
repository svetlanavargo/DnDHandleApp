import { memo, useMemo } from 'react';
import type { BattleCard } from '../../../hooks/useBattle.ts';
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
    startFight: () => void,
    nextMove: () => void,
    onOpenSettings: () => void;
    listOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Times({isBattle, round, timer, turnCounter, startFight, nextMove, stopBattle, battleCards, expiredConditions, onOpenSettings, listOpen }: TimesProps) {
    const formattedTime = useMemo(() => {
        const totalSeconds = Math.floor(timer);

        const min = Math.floor(totalSeconds / 60);
        const sec = totalSeconds % 60;

        const formattedMin = String(min).padStart(2, '0');
        const formattedSec = String(sec).padStart(2, '0');

        return `${formattedMin}:${formattedSec}`;
    }, [timer]);

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
