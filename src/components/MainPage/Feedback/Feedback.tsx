import styles from './Feedback.module.css';

export default function Feedback() {
    return (
        <section className={styles.feedback} aria-labelledby="feedback-title">
            <div className={styles.content}>
                <p className={styles.eyebrow}>Обратная связь</p>
                <h2 id="feedback-title" className={styles.title}>Давайте сделаем приложение лучше</h2>
                <p className={styles.description}>
                    Делитесь идеями, замечаниями и находками в нашем Telegram-канале.
                </p>
            </div>

            <a
                className={styles.telegramLink}
                href="https://t.me/+BBNlq88UfOszMjgy"
                target="_blank"
                rel="noreferrer"
            >
                <span>Telegram-канал</span>
                <svg className={styles.telegramIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21.3 3.3 18.2 20c-.2 1.2-1 1.5-1.9.9l-5.4-4-2.6 2.5c-.3.3-.5.5-1 .5l.4-5.5 10-9c.4-.4-.1-.7-.7-.3L4.7 12.8l-5.3-1.7c-1.2-.4-1.2-1.2.3-1.8L20.4 1.3c1-.4 1.3.2.9 2Z" />
                </svg>
            </a>
        </section>
    );
}
