import { Link } from 'react-router-dom';
import styles from './Warning.module.css';

function Warning() {
    return(
       <div className={styles.warningContainer}>
           <div className={styles.warning}>
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
