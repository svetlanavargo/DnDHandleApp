import { useState, useContext, useEffect } from 'react';
import { CharacterContext } from '../../context/CharacterContext';
import type { Currency } from '../../types/dnd.ts';
import type { Character as CharacterType } from '../../types/Character.ts'
import InventoryList from './InventoryList/InventoryList.tsx';
import CurrencyList from './CurrencyList/CurrencyList.tsx';
import { useNumberModal } from '../../hooks/useNumberModal.ts';
import Modal from '../Modals/Modal.tsx';
import ChangeHitsModal from '../Modals/ChangeHitsModal.tsx';
import NoCharacter from '../Stubs/NoCharacter/NoCharacter.tsx';
import styles from './Inventory.module.css';

function Inventory() {
    const { characters, activeCharacterId, updateCharacter } = useContext(CharacterContext);

    const activeCharacter = characters.find(c => c.id === activeCharacterId) ?? null;

    const numberModal = useNumberModal();

    const [text, setText] = useState<string>('');
    const [currency, setCurrency] = useState<Currency>({
        platinum: 0,
        gold: 0,
        silver: 0,
        bronze: 0
    });

    useEffect(() => {
        if (!activeCharacter) return;

        queueMicrotask(() => {
            setText(activeCharacter.inventory.note);
            setCurrency(activeCharacter.inventory.currency);
        });
    }, [activeCharacter]);

    const updateInventory = (updateFn: (inv: CharacterType['inventory']) => CharacterType['inventory']) => {
        if (!activeCharacter) return;
        const updatedInventory = updateFn(activeCharacter.inventory);
        updateCharacter({ ...activeCharacter, inventory: updatedInventory });
    };

    const handleTextChange = (newText: string) => {
        setText(newText);
        updateInventory(inv => ({ ...inv, note: newText }));
    };

    const increment = (key: keyof Currency) => {
        updateInventory(inv => {
            const updated = { ...inv.currency, [key]: inv.currency[key] + 1 };
            setCurrency(updated);
            return { ...inv, currency: updated };
        });
    };

    const decrement = (key: keyof Currency) => {
        updateInventory(inv => {
            const updated = { ...inv.currency, [key]: Math.max(0, inv.currency[key] - 1) };
            setCurrency(updated);
            return { ...inv, currency: updated };
        });
    };

    const onCalc = (key: keyof Currency) => {
        numberModal.openModal({
            title: `Изменение ${key}, введи +-`,
            max: 100000,
            onConfirm: (value) => {
                updateInventory(inv => {
                    const updated = { ...inv.currency, [key]: Math.max(0, inv.currency[key] + value) };
                    setCurrency(updated);
                    return { ...inv, currency: updated };
                });
            }
        });
    };

    // Если персонаж не выбран, показываем заглушку
    if (!activeCharacter) {
        return <NoCharacter text='Для просмотра инвентаря - необходимо '/>;
    }

    return (
        <div className={styles.inventoryContainer}>
            <div className={styles.inventory}>
                <InventoryList
                    text={text}
                    setText={handleTextChange}
                />
                <CurrencyList
                    currency={currency}
                    increment={key => increment(key as keyof Currency)}
                    decrement={key => decrement(key as keyof Currency)}
                    onCalc={key => onCalc(key as keyof Currency)}
                />
            </div>

            <Modal isOpen={numberModal.isOpen} size="small">
                {numberModal.isOpen && numberModal.onConfirm && (
                    <ChangeHitsModal
                        title={numberModal.title}
                        max={numberModal.max}
                        onConfirm={numberModal.onConfirm}
                        onClose={numberModal.closeModal}
                    />
                )}
            </Modal>
        </div>
    );
}

export default Inventory;