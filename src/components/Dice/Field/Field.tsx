import Btn from '../../UI/Btn/Btn.tsx';
import type { Roll } from '../../../types/dnd.ts';
import styles from './Field.module.css';


interface Props {
    total: number;
    history: Roll[];
    onReset: () => void;
    onInc: () => void;
    onDec: () => void;
}

const getDiceIcon = (roll: Roll): string => {
    if (roll.magnitude === 'manual') {
        return roll.type === 'plus'
            ? '/img/plus.svg'
            : '/img/minus.svg';
    }

    return `/img/Dices/d${roll.magnitude}.svg`;
};

function Field({ total, history, onReset, onInc, onDec }: Props) {
    const hasTotal = total > 0;

    const reversedHistory = [...history].reverse();

    return (
        <div className={styles.container}>
            <div className={styles.history}>
                {reversedHistory.map((roll, index) => (
                    <div
                        key={`${roll.value}-${index}`} // лучше чем просто index
                        className={styles.historyWrapper}
                    >
                        <img
                            className={styles.historyImg}
                            src={getDiceIcon(roll)}
                            alt=""
                        />
                        <span className={styles.historyRollValue}>
                            {roll.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className={styles.totalHandler}>
                {hasTotal && <Btn onClick={onDec} classBtn="minus" />}

                <div className={styles.total}>
                    <span>{total}</span>
                </div>

                {hasTotal && <Btn onClick={onInc} classBtn="plus" />}
            </div>

            {hasTotal && (
                <Btn onClick={onReset} classBtn="resetDice" />
            )}
        </div>
    );
}

export default Field;