import { useState } from 'react';
import SpellCard from '../SpellCard/SpellCard.tsx';
import EmptyState from '../../UI/EmptyState/EmptyState.tsx';
import styles from "./SpellsListView.module.css";

import type { Spell, SpellLevel } from "../../../types/dnd";

interface SpellsListViewProps {
    fill: string;
    spells: Spell[];
    groupedSpells?: Record<string, Spell[]>;
    onEmptyStackClick?: (level: SpellLevel) => void;
}

function getSpellLevelLabel(level: string): string {
    if (level === '0') return 'Заговоры';
    return level;
}

function SpellsListView({ spells, fill, groupedSpells, onEmptyStackClick }: SpellsListViewProps) {
    const [activeCard, setActiveCard] = useState<string | null>(null);
    const hasDesktopStacks = Boolean(groupedSpells);

    if ((!spells || spells.length === 0) && !hasDesktopStacks) {
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
            <div className={styles.mobileStack}>
                {spells.length === 0 ? (
                    <EmptyState
                        image={<div className={styles.cards} />}
                        text="В списке заклинаний пусто :("
                    />
                ) : (
                    spells.map((spell, i) => {
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
                    })
                )}
            </div>

            {groupedSpells && (
                <div className={styles.desktopStacks}>
                    {Object.entries(groupedSpells).map(([level, levelSpells]) => (
                        <div key={level} className={styles.levelStack}>
                            <button
                                type="button"
                                className={styles.levelBadge}
                                onClick={() => onEmptyStackClick?.(level as SpellLevel)}
                            >
                                {getSpellLevelLabel(level)}
                            </button>

                            <div className={styles.stackField}>
                                {levelSpells.length === 0 ? (
                                    <button
                                        type="button"
                                        className={styles.emptyStack}
                                        onClick={() => onEmptyStackClick?.(level as SpellLevel)}
                                    >
                                        +
                                    </button>
                                ) : (
                                    levelSpells.map((spell, index) => {
                                        const isActive = activeCard === spell.url;

                                        return (
                                            <div
                                                key={spell.url}
                                                className={`${styles.desktopCardWrapper} ${
                                                    isActive ? styles.desktopActive : ''
                                                }`}
                                                onClick={() =>
                                                    setActiveCard((prev) =>
                                                        prev === spell.url ? null : spell.url
                                                    )
                                                }
                                                style={{
                                                    transform: `
                                                        translateX(-50%)
                                                        translateY(${index * 24}px)
                                                        ${isActive ? 'translateY(-12px)' : ''}
                                                        scale(${isActive ? 0.82 : 0.76})
                                                    `,
                                                    zIndex: isActive ? 20 : index + 1,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <SpellCard spell={spell} fill={fill} size="small" />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SpellsListView;
