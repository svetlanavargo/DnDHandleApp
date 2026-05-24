import { useEffect, useState } from 'react';

export function useDelayedFlag(active: boolean, delayMs = 1000) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            setIsVisible(active);
        }, active ? delayMs : 0);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [active, delayMs]);

    return active && isVisible;
}
