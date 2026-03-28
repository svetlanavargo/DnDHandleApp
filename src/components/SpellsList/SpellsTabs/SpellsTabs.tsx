import type { SpellLevel, SpellsList } from '../../../types/dnd';
import styles from './SpellsTabs.module.css';

interface SpellsTabsProps {
    spells: SpellsList;
    activeTab: SpellLevel;
    onChange: (level: SpellLevel) => void;
}

function SpellsTabs({ spells, activeTab, onChange }: SpellsTabsProps) {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
                {(Object.entries(spells) as [SpellLevel, string[]][])
                    .map(([level]) => (
                        <div
                            key={level}
                            className={`${styles.tab} ${
                                activeTab === level ? styles.active : ''
                            }`}
                            onClick={() => onChange(level)}
                        >
                            {level === "0" ? 'Заговоры' : level}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default SpellsTabs;