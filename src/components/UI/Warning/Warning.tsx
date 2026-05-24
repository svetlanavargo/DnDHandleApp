import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './Warning.module.css';

function Warning() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return(
       <div className={styles.warningContainer}>
           <div className={styles.warning}>
               <button
                   type="button"
                   className={styles.close}
                   aria-label="Закрыть предупреждение"
                   onClick={() => setIsVisible(false)}
               >
                   ×
               </button>
               <div className={styles.icon} aria-hidden="true">!</div>
               <div className={styles.content}>
                   <p className={styles.title}>Гостевой режим</p>
                   <p className={styles.text}>
                       После перезагрузки страницы данные будут удалены. Войди, чтобы сохранить их.
                   </p>
                   <Link to="/login" className={styles.link}>
                       Войти
                   </Link>
               </div>
           </div>
       </div>
    )
}

export default Warning
