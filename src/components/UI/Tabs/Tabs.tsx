import Btn from '../Btn/Btn.tsx';
import styles from './Tabs.module.css';

interface TabItem {
    id: string;
    label: string;
}

interface TabsProps {
    items: TabItem[];
    activeId: string;
    setActive: (id: string) => void;
    onAdd?: () => void;
    maxItems?: number;
}

function Tabs({ items, activeId, setActive, onAdd, maxItems = 6 }: TabsProps) {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`${styles.tab}${item.id === activeId ? ` ${styles.activeTab}` : ''}`}
                        onClick={() => setActive(item.id)}
                    >
                        <span>{item.label}</span>
                    </div>
                ))}

                {onAdd && items.length < maxItems && (
                    <div className={styles.btnWrapper}>
                        <Btn onClick={onAdd} classBtn="addCharacter" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tabs;