import styles from './Warning.module.css';

function Warning() {
    return(
        <div className={styles.warning}>
            После перезагрузки страницы данные будут удалены. Войди, чтобы сохранить их.
        </div>
    )
}

export default Warning