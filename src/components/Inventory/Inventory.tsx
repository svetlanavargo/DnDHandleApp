import { useState } from 'react';
import InventoryList from './InventoryList/InventoryList.tsx';
import CurrencyList from './CurrencyList/CurrencyList.tsx';
import { useNumberModal } from '../../hooks/useNumberModal.ts';
import Modal from '../Modals/Modal.tsx';
import ChangeHitsModal from '../Modals/ChangeHitsModal.tsx';
import styles from './Inventory.module.css';

export interface Currency {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
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

    const numberModal = useNumberModal();

    const handleSetText = (newText: string) => setText(newText);

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

    const onCalc = (key: keyof Currency) => {
        numberModal.openModal({
            title: `Изменение ${key}, введи +-`,
            min: undefined,
            max: undefined,
            onConfirm: (value) => {
                setCurrency(prev => ({
                    ...prev,
                    [key]: Math.max(0, prev[key] + value)
                }));
            }
        });
    };

    // синхронизация с localStorage
    useState(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
        localStorage.setItem('note', text);
    });

    return (
        <div className={styles.inventoryContainer}>
            <div className={styles.inventory}>
                <InventoryList text={text} setText={handleSetText} />
                <CurrencyList
                    currency={currency}
                    increment={increment}
                    decrement={decrement}
                    onCalc={onCalc}
                />
            </div>

            <Modal isOpen={numberModal.isOpen} size="small">
                {numberModal.isOpen && numberModal.onConfirm && (
                    <ChangeHitsModal
                        title={numberModal.title}
                        onConfirm={numberModal.onConfirm}
                        onClose={numberModal.closeModal}
                    />
                )}
            </Modal>
        </div>
    );
}

export default Inventory;