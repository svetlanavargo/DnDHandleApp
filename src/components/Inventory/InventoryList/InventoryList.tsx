import { memo } from 'react';
import styles from './InventoryList.module.css';

interface InventoryListProps {
    text: string;
    setText: (newText: string) => void;
    onBlur: () => void;
}

function InventoryList({ text, setText, onBlur }: InventoryListProps) {
    return (
        <div className={styles.inventoryListContainer}>
            <textarea className={styles.contentEditable}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={onBlur}
                placeholder="Записывай сюда свое барахло"
            />
        </div>
    );
}

export default memo(InventoryList);
