import Btn from '../../UI/Btn/Btn.tsx';
import type { Character } from '../CharacterList';
import styles from './Tabs.module.css';

interface TabsProps {
    characters: Character[];
    activeId: number;
    setActive: (id: number) => void;
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
                    <Btn onClick={addCharacter} classBtn='addCharacter'/>
                )}
            </div>
        </div>
    );
}

export default Tabs;