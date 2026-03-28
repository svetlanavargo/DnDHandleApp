import { useState } from "react";
import SpellCard from "../SpellCard/SpellCard.tsx";
import styles from "./SpellsListView.module.css";

import type { Spell } from "../../../types/dnd";

interface SpellsListViewProps {
    fill: string;
    spells: Spell[];
}

function SpellsListView({ spells, fill }: SpellsListViewProps) {
    const [activeCard, setActiveCard] = useState<string | null>(null);

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
                            zIndex: isActive ? 999 : i,
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