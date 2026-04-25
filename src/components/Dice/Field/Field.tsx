import Btn from '../../UI/Btn/Btn.tsx';
import type { Roll } from '../../../types/dnd.ts';
import styles from './Field.module.css';
import plusIcon from '../../../assets/img/plus.svg';
import minusIcon from '../../../assets/img/minus.svg';
import d2Icon from '../../../assets/img/Dices/d2.svg';
import d4Icon from '../../../assets/img/Dices/d4.svg';
import d6Icon from '../../../assets/img/Dices/d6.svg';
import d8Icon from '../../../assets/img/Dices/d8.svg';
import d10Icon from '../../../assets/img/Dices/d10.svg';
import d12Icon from '../../../assets/img/Dices/d12.svg';
import d20Icon from '../../../assets/img/Dices/d20.svg';
import d100Icon from '../../../assets/img/Dices/d100.svg';


interface Props {
    total: number;
    history: Roll[];
    onReset: () => void;
    onInc: () => void;
    onDec: () => void;
}

const DICE_ICONS: Record<number, string> = {
    2: d2Icon,
    4: d4Icon,
    6: d6Icon,
    8: d8Icon,
    10: d10Icon,
    12: d12Icon,
    20: d20Icon,
    100: d100Icon,
};

const getDiceIcon = (roll: Roll): string => {
    if (roll.magnitude === 'manual') {
        return roll.type === 'plus'
            ? plusIcon
            : minusIcon;
    }

    return DICE_ICONS[roll.magnitude];
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
