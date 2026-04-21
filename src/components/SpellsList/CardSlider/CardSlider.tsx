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
    const isDraggingRef = useRef(false);
    const dragStartXRef = useRef(0);
    const startScrollLeftRef = useRef(0);
    const movedDuringDragRef = useRef(false);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // 🔥 защита от out-of-range
    const safeItems = useMemo(() => items ?? [], [items]);
    const normalizedActiveIndex = Math.min(
        activeIndex,
        Math.max(safeItems.length - 1, 0)
    );
    const activeItem = safeItems[normalizedActiveIndex];

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
        if (isDraggingRef.current) {
            return;
        }

        const index = getActiveIndex();

        setActiveIndex(index);

        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            snapTo(index);
        }, 120);
    };

    const stopDragging = () => {
        if (!isDraggingRef.current) {
            return;
        }

        isDraggingRef.current = false;
        setIsDragging(false);

        const index = getActiveIndex();
        setActiveIndex(index);
        snapTo(index);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) {
            return;
        }

        isDraggingRef.current = true;
        movedDuringDragRef.current = false;
        setIsDragging(true);
        dragStartXRef.current = event.clientX;
        startScrollLeftRef.current = ref.current.scrollLeft;
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current || !ref.current) {
            return;
        }

        const deltaX = event.clientX - dragStartXRef.current;

        if (Math.abs(deltaX) > 3) {
            movedDuringDragRef.current = true;
        }

        ref.current.scrollLeft = startScrollLeftRef.current - deltaX;
    };

    const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
        if (movedDuringDragRef.current) {
            event.preventDefault();
            event.stopPropagation();
            movedDuringDragRef.current = false;
        }
    };

    const handleDragStartCapture = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        window.addEventListener('mouseup', stopDragging);

        return () => {
            window.removeEventListener('mouseup', stopDragging);
        };
    });

    return (
        <div className={styles.wrapper}>
            <div
                ref={ref}
                className={`${styles.slider} ${isDragging ? styles.sliderDragging : ''}`}
                onScroll={onScroll}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onClickCapture={handleClickCapture}
                onDragStartCapture={handleDragStartCapture}
            >
                {safeItems.map((item, i) => {
                    const distance = Math.abs(i - normalizedActiveIndex);

                    const scale = Math.max(0.85, 1 - distance * 0.12);
                    const opacity = Math.max(0.5, 1 - distance * 0.25);

                    return (
                        <div
                            key={getKey(item)}
                            className={styles.card}
                            draggable={false}
                            style={{
                                transform: `scale(${scale})`,
                                opacity
                            }}
                        >
                            {renderItem(item, i === normalizedActiveIndex)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CardSlider;
