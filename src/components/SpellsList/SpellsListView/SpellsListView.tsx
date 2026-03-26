import SpellCard from "../SpellCard/SpellCard.tsx";
import styles from './SpellsListView.module.css';
import type { Spell } from "../../../types/dnd.ts";

interface SpellsListViewProps {
    fill: string,
    spells: Spell[]
}

function SpellsListView({ spells, fill }: SpellsListViewProps) {
    return (
        <div className={styles.spellsListViewContainer}>
            {spells.map((spell, i) => (
                <SpellCard
                    key={spell.url}
                    spell={spell}
                    fill={fill}
                    style={{
                        zIndex: spells.length - i
                    }}
                />
            ))}
        </div>
    );
}

export default SpellsListView;