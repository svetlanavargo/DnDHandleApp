import { useEffect, useRef } from 'react';
import Btn from '../Btn/Btn.tsx';
import styles from './Tabs.module.css';

interface TabItem {
    id: string;
    label: string;
}

interface TabsProps {
    items: TabItem[];
    activeId: string;
    setActive: (id: string) => void;
    onAdd?: () => void;
    addDisabled?: boolean;
    addStatusText?: string;
    maxItems?: number;
}

function Tabs({
    items,
    activeId,
    setActive,
    onAdd,
    addDisabled,
    addStatusText,
    maxItems = 6
}: TabsProps) {
    const tabsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const tabsElement = tabsRef.current;

        if (!tabsElement) {
            return;
        }

        const handleWheel = (event: WheelEvent) => {
            if (tabsElement.scrollWidth <= tabsElement.clientWidth) {
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
            tabsElement.scrollLeft += delta;
        };

        tabsElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            tabsElement.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className={styles.tabsWrapper}>
            <div ref={tabsRef} className={styles.tabs}>
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`${styles.tab}${item.id === activeId ? ` ${styles.activeTab}` : ''}`}
                        onClick={() => setActive(item.id)}
                    >
                        <span>{item.label}</span>
                    </div>
                ))}

                {onAdd && items.length < maxItems && (
                    <div className={styles.btnWrapper}>
                        <Btn
                            onClick={onAdd}
                            classBtn="addCharacter"
                            disabled={addDisabled}
                        />
                    </div>
                )}
            </div>

            {addStatusText && (
                <p className={styles.statusText}>{addStatusText}</p>
            )}
        </div>
    );
}

export default Tabs;
