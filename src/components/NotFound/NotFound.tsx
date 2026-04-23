import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styles from "./NotFound.module.css";

function NotFound() {
    return (
        <div className={styles.wrapper}>
            <Helmet>
                <title>404 — Страница не найдена</title>
            </Helmet>

            <div className={styles.glowLeft} />
            <div className={styles.glowRight} />

            <div className={styles.content}>
                <div className={styles.badge}>Ошибка навигации</div>
                <div className={styles.hero}>
                    <div className={styles.codeBlock}>
                        <h1 className={styles.code}>404</h1>
                        <p className={styles.caption}>страница не найдена</p>
                    </div>

                    <div className={styles.textBlock}>
                        <h2 className={styles.title}>Похоже, маршрут оборвался где-то между подземельями.</h2>
                        <p className={styles.text}>
                            Такой страницы сейчас нет, адрес мог измениться или ссылка оказалась битой.
                            Быстрее всего вернуться на главную и продолжить оттуда.
                        </p>

                        <div className={styles.actions}>
                            <Link to="/" className={styles.primaryButton}>
                                На главную
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
