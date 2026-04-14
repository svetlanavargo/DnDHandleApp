import { useState } from 'react';
import SpellCard from '../SpellCard/SpellCard.tsx';
import EmptyState from '../../UI/EmptyState/EmptyState.tsx';
import styles from "./SpellsListView.module.css";

import type { Spell } from "../../../types/dnd";

interface SpellsListViewProps {
    fill: string;
    spells: Spell[];
}

function SpellsListView({ spells, fill }: SpellsListViewProps) {
    const [activeCard, setActiveCard] = useState<string | null>(null);

    if (!spells || spells.length === 0) {
        return (
            <div className={styles.spellsListViewContainer}>
                <EmptyState
                    image={<div className={styles.cards} />}
                    text="В списке заклинаний пусто :("
                />
            </div>
        );
    }

    return (
        <div className={styles.spellsListViewContainer}>
            {spells.map((spell, i) => {
                const overlap = 120;
                const offset = i * overlap;

                const isActive = activeCard === spell.url;

                return (
                    <div
                        key={spell.url}
                        className={`${styles.cardWrapper} ${
                            isActive ? styles.active : ""
                        }`}
                        onClick={() =>
                            setActiveCard((prev) =>
                                prev === spell.url ? null : spell.url
                            )
                        }
                        style={{
                            transform: `
                                translateX(-50%)
                                translateY(${offset}px)
                                ${isActive ? "translateY(-20px)" : ""}
                                scale(${isActive ? 1.04 : 1})
                            `,
                            zIndex: isActive ? 10 : i,
                            cursor: "pointer"
                        }}
                    >
                        <SpellCard spell={spell} fill={fill} />
                    </div>
                );
            })}
        </div>
    );
}

export default SpellsListView;