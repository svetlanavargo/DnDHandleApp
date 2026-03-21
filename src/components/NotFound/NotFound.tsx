import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import styles from "./NotFound.module.css";

function NotFound() {
    return (
        <div className={styles.wrapper}>
            <Helmet>
                <title>404 — Страница не найдена</title>
            </Helmet>

            <div className={styles.content}>
                <h1 className={styles.code}>404</h1>
                <p className={styles.text}>Страница потерялась в подземелье 🐉</p>

                <Link to="/" className={styles.button}>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
}

export default NotFound;