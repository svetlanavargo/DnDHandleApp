import React, { useRef, useState, useEffect, useMemo } from "react";
import styles from "./CardSlider.module.css";

type Props<T> = {
    items: T[];
    getKey: (item: T) => string;
    renderItem: (item: T, active: boolean) => React.ReactNode;
    onActiveChange?: (item: T) => void;
};

function CardSlider<T>({
                           items,
                           getKey,
                           renderItem,
                           onActiveChange
                       }: Props<T>) {
    const ref = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);

    // 🔥 защита от out-of-range
    const safeItems = useMemo(() => items ?? [], [items]);

    const activeItem = safeItems[activeIndex];

    // 🚀 уведомляем родителя только когда реально есть item
    useEffect(() => {
        if (activeItem) {
            onActiveChange?.(activeItem);
        }
    }, [activeItem, onActiveChange]);

    const getActiveIndex = () => {
        if (!ref.current) return 0;

        const container = ref.current;
        const cards = Array.from(container.children) as HTMLElement[];

        const containerRect = container.getBoundingClientRect();
        const center = containerRect.left + containerRect.width / 2;

        let closest = 0;
        let minDist = Infinity;

        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;

            const dist = Math.abs(center - cardCenter);

            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        });

        return closest;
    };

    const snapTo = (index: number) => {
        if (!ref.current) return;

        const container = ref.current;
        const cards = Array.from(container.children) as HTMLElement[];

        const card = cards[index];
        if (!card) return;

        const containerRect = container.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        const offset =
            cardRect.left +
            cardRect.width / 2 -
            (containerRect.left + containerRect.width / 2);

        container.scrollBy({
            left: offset,
            behavior: "smooth"
        });
    };

    const onScroll = () => {
        const index = getActiveIndex();

        setActiveIndex(index);

        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            snapTo(index);
        }, 120);
    };

    useEffect(() => {
        if (safeItems.length > 0) {
            setActiveIndex(0);
        }
    }, [safeItems]);

    return (
        <div className={styles.wrapper}>
            <div ref={ref} className={styles.slider} onScroll={onScroll}>
                {safeItems.map((item, i) => {
                    const distance = Math.abs(i - activeIndex);

                    const scale = Math.max(0.85, 1 - distance * 0.12);
                    const opacity = Math.max(0.5, 1 - distance * 0.25);

                    return (
                        <div
                            key={getKey(item)}
                            className={styles.card}
                            style={{
                                transform: `scale(${scale})`,
                                opacity
                            }}
                        >
                            {renderItem(item, i === activeIndex)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CardSlider;