import styles from './InventoryList.module.css';

interface InventoryListProps {
    text: string;
    setText: (newText: string) => void;
}

function InventoryList({ text, setText }: InventoryListProps) {
    return (
        <div className={styles.inventoryListContainer}>
            <textarea className={styles.contentEditable}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Записывай сюда свое барахло"
            />
        </div>
    );
}

export default InventoryList;