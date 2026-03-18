import Btn from '../../UI/Btn/Btn.tsx';
import type { Character } from '../../../types/Character.ts';
import styles from './Tabs.module.css';

interface TabsProps {
    characters: Character[];
    activeId: string;
    setActive: (id: string) => void;
    addCharacter: () => void;
}

function Tabs({ characters, activeId, setActive, addCharacter }: TabsProps) {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
                {characters.map((c) => (
                    <div
                        key={c.id}
                        className={`${styles.tab}${c.id === activeId ? ` ${styles.activeTab}` : ''}`}
                        onClick={() => setActive(c.id)}
                    >
                        <span>{c.name}</span>
                    </div>
                ))}
                {characters.length < 6 && (
                    <div className={styles.btnWrapper}>
                        <Btn onClick={addCharacter} classBtn='addCharacter'/>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tabs;