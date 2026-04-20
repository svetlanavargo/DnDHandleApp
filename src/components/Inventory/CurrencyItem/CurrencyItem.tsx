import { memo } from 'react';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './CurrencyItem.module.css';

interface Props {
    value: number,
    type: string,
    increment: () => void;
    decrement: () => void;
    onCalc: () => void;
}

function CurrencyItem({ value, type, increment, decrement, onCalc }: Props) {
    return(
        <div className={styles.currencyItemContainer}>
            <div className={styles[type]}/>
            <div className={styles.btnWrapper}>
                <Btn onClick={decrement} classBtn='subtractHits'/>
                <div className={styles.value}>{value}</div>
                <Btn onClick={increment} classBtn='addHits'/>
            </div>
            <Btn onClick={onCalc} classBtn='edit'/>
        </div>
    )
}

export default memo(CurrencyItem)
