import { useEffect, useRef, useState } from 'react';
import SpellCard from '../SpellCard/SpellCard.tsx';
import EmptyState from '../../UI/EmptyState/EmptyState.tsx';
import styles from "./SpellsListView.module.css";

import type { Spell, SpellLevel } from "../../../types/dnd";

interface SpellsListViewProps {
    fill: string;
    groupedSpells?: Record<string, Spell[]>;
    onEmptyStackClick?: (level: SpellLevel) => void;
}

function getSpellLevelLabel(level: string): string {
    if (level === '0') return 'Заговоры';
    return level;
}

function getStackContentHeight(cardsCount: number) {
    const baseCardHeight = 340;
    const overlapOffset = 36;

    if (cardsCount <= 0) {
        return baseCardHeight;
    }

    return baseCardHeight + Math.max(cardsCount - 1, 0) * overlapOffset;
}

function SpellsListView({ fill, groupedSpells, onEmptyStackClick }: SpellsListViewProps) {
    const [activeCard, setActiveCard] = useState<string | null>(null);
    const hasStacks = Boolean(groupedSpells);
    const stackEntries = groupedSpells ? Object.entries(groupedSpells) : [];
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const containerElement = containerRef.current;

        if (!containerElement) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            const target = event.target;

            if (target instanceof HTMLElement) {
                const stackField = target.closest<HTMLElement>(`.${styles.stackField}`);

                if (stackField && stackField.scrollHeight > stackField.clientHeight) {
                    const verticalDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
                        ? event.deltaY
                        : event.deltaX;

                    if (verticalDelta !== 0) {
                        event.preventDefault();
                        event.stopPropagation();
                        stackField.scrollTop += verticalDelta;
                        return;
                    }
                }
            }

            if (containerElement.scrollWidth <= containerElement.clientWidth) {
                return;
            }

            const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
                ? event.deltaX
                : event.deltaY;

            if (delta === 0) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            containerElement.scrollLeft += delta;
        };

        containerElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            containerElement.removeEventListener('wheel', handleWheel);
        };
    }, []);

    if (!hasStacks) {
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
        <div ref={containerRef} className={styles.spellsListViewContainer}>
            {groupedSpells && (
                <div
                    className={styles.stacks}
                    style={{
                        gridTemplateColumns: `repeat(${stackEntries.length}, minmax(250px, 1fr))`
                    }}
                >
                    {stackEntries.map(([level, levelSpells]) => (
                        <div key={level} className={styles.levelStack}>
                            <button
                                type="button"
                                className={styles.levelBadge}
                                onClick={() => onEmptyStackClick?.(level as SpellLevel)}
                            >
                                {getSpellLevelLabel(level)}
                            </button>

                            <div className={styles.stackField}>
                                <div
                                    className={styles.stackContent}
                                    style={{ height: `${getStackContentHeight(levelSpells.length)}px` }}
                                >
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
                                                    className={`${styles.stackCardWrapper} ${
                                                        isActive ? styles.stackCardActive : ''
                                                    }`}
                                                    onClick={() =>
                                                        setActiveCard((prev) =>
                                                            prev === spell.url ? null : spell.url
                                                        )
                                                    }
                                                    style={{
                                                        transform: `
                                                            translateX(-50%)
                                                            translateY(${index * 36}px)
                                                            ${isActive ? 'translateY(-16px)' : ''}
                                                            scale(${isActive ? 0.72 : 0.68})
                                                        `,
                                                        zIndex: isActive ? 20 : index + 1,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <SpellCard spell={spell} fill={fill} size="big" />
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SpellsListView;
