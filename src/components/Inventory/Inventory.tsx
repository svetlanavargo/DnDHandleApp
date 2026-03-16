import { useState, useEffect } from 'react';
import InventoryList from './InventoryList/InventoryList.tsx';
import CurrencyList from './CurrencyList/CurrencyList.tsx';
import styles from './Inventory.module.css';

export interface Currency {
    platinum: number
    gold: number
    silver: number
    bronze: number
}

const defaultCurrency: Currency = {
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0
};

function Inventory() {
    const [text, setText] = useState(() => {
        const saved = localStorage.getItem('note');
        return saved ?? '';
    });
    const [currency, setCurrency] = useState<Currency>(() => {
        const saved = localStorage.getItem('currency');
        return saved ? JSON.parse(saved) : defaultCurrency;
    });

    const handleSetText = (newText: string) => {
        setText(newText);
    }

    const increment = (key: keyof Currency) => {
        setCurrency(prev => ({
            ...prev,
            [key]: prev[key] + 1
        }));
    };

    const decrement = (key: keyof Currency) => {
        setCurrency(prev => ({
            ...prev,
            [key]: prev[key] > 0 ? prev[key] - 1 : 0
        }));
    };

    const onCalc = (key: keyof  Currency) => {
        const input = prompt('Введите число (можно отрицательное):');

        if (input === null) return;

        const value = Number(input);

        if (Number.isNaN(value)) {
            alert('Нужно ввести число');
            return;
        }

        setCurrency(prev => {
            const newValue = prev[key] + value;

            return {
                ...prev,
                [key]: newValue < 0 ? 0 : newValue
            };
        });
    }

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency]);

    useEffect(() => {
        localStorage.setItem('note', text);
    }, [text]);

    return (
        <div className={styles.inventoryContainer}>
            <div className={styles.inventory}>
                <InventoryList text={text} setText={handleSetText}/>
                <CurrencyList
                    currency={currency}
                    increment={increment}
                    decrement={decrement}
                    onCalc={onCalc}
                />
            </div>
        </div>
    )
}

export default Inventory