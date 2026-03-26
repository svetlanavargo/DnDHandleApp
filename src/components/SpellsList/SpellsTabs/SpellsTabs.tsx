import type { SpellSlotsState } from '../../../types/dnd.ts';
import styles from './SpellsTabs.module.css';


interface SpellsTabsProps {
    slots: SpellSlotsState;
    activeTab: string;
    onChange: (level: string) => void;
}

function SpellsTabs({ slots, activeTab, onChange }: SpellsTabsProps) {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabs}>
                {Object.entries(slots).map(([level]) => (
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