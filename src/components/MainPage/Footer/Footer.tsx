import Logo from '../../../../public/img/dnd.svg';
import styles from './Footer.module.css';

export default function Footer() {
    return(
        <div className={styles.footerContainer}>
            <div className={styles.footerWrapper}>
                <div className={styles.flex}>
                    <img src={Logo} alt="Logo" className={styles.logo}/>
                    <p>DndApp - by Vargo 2026</p>
                </div>
            </div>
        </div>
    )
}