import styles from './MainPage.module.css';

function MainPage() {
    return(
        <div className={styles.mainPageContainer}>
            <div className={styles.mainPage}>
                <h1>DnD Combat Tracker и менеджер персонажей</h1>

                <p>
                    DnD Tracker — это удобное приложение для мастеров и игроков.
                    Следите за инициативой, хп, эффектами и состоянием боя в реальном времени.
                </p>
            </div>
        </div>
    )
}

export default MainPage;