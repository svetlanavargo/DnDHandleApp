import { memo } from 'react';
import type { Currency } from '../../../types/dnd.ts';
import CurrencyItem from '../CurrencyItem/CurrencyItem.tsx';
import styles from './CurrencyList.module.css';

interface Props {
    currency: Currency;
    increment: (key: keyof Currency) => void;
    decrement: (key: keyof Currency) => void;
    onCalc: (key: keyof Currency) => void;
}

const currencyConfig: { key: keyof Currency}[] = [
    { key: 'platinum'},
    { key: 'gold'},
    { key: 'silver'},
    { key: 'bronze'}
];

function CurrencyList({ currency, increment, decrement, onCalc }: Props) {
    return (
        <div className={styles.currencyListContainer}>
            <div className={styles.currencyList}>
                {currencyConfig.map(({ key }) => (
                    <CurrencyItem
                        key={key}
                        type={key}
                        value={currency[key]}
                        increment={() => increment(key)}
                        decrement={() => decrement(key)}
                        onCalc={() => onCalc(key)}
                    />
                ))}
            </div>
        </div>
    );
}

export default memo(CurrencyList);
