import styles from './SessionLoading.module.css';

function SessionLoading() {
    return (
        <div className={styles.screen}>
            <div className={styles.panel}>
                <div className={styles.spinner} />
                <h1 className={styles.title}>Восстанавливаем сессию</h1>
                <p className={styles.text}>
                    Загружаем аккаунт и игровые данные. Это обычно занимает пару секунд.
                </p>
            </div>
        </div>
    );
}

export default SessionLoading;
