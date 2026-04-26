import { useEffect, useState } from 'react';

export function useDelayedFlag(active: boolean, delayMs = 1000) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!active) {
            setIsVisible(false);
            return;
        }

        const timerId = window.setTimeout(() => {
            setIsVisible(true);
        }, delayMs);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [active, delayMs]);

    return isVisible;
}
