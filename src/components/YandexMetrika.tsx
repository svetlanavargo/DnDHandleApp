import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface YandexMetrikaProps {
    id: number;
}

declare global {
    interface Window {
        ym?: (id: number, action: 'init' | 'hit', params?: Record<string, unknown> | string) => void;
        [key: string]: unknown;
    }
}

const YandexMetrika = ({ id }: YandexMetrikaProps) => {
    const location = useLocation();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Инициализация ym, если ещё нет
        if (!window.ym) {
            (function (m: Window, e: Document, t: string, r: string, i: string) {
                const ymFn = (...args: unknown[]) => {
                    const arr = (ymFn as any).a || [];
                    arr.push(args);
                    (ymFn as any).a = arr;
                };
                (m as any)[i] = ymFn;
                (ymFn as any).l = Date.now();

                const k = e.createElement(t) as HTMLScriptElement;
                const a = e.getElementsByTagName(t)[0];
                k.async = true;
                k.src = r;
                a.parentNode?.insertBefore(k, a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            // Инициализация счётчика
            // @ts-expect-error
            window.ym(id, 'init', {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true,
            });
        }

        // Добавляем noscript один раз
        if (document.body && !document.getElementById('yandex-metrika-noscript')) {
            const noscript = document.createElement('noscript');
            noscript.id = 'yandex-metrika-noscript';
            noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${id}" style="position:absolute; left:-9999px;" alt="" /></div>`;
            document.body.appendChild(noscript);
        }
    }, [id]);

    // Отслеживание route
    useEffect(() => {
        if (window.ym) {
            window.ym(id, 'hit', location.pathname);
        }
    }, [location, id]);

    return null;
};

export default YandexMetrika;