import { Link } from 'react-router-dom';
import Logo from '../../../../public/img/dnd.svg';
import styles from './Footer.module.css';

const FOOTER_TEXT = {
    brand: 'DnD App - by Vargo 2026',
    description: 'Инструменты для мастеров и игроков: бой, персонажи, заклинания, инвентарь и всё, что должно быть под рукой во время сессии.',
    patchNotes: 'Журнал',
    battleTracker: 'Трекер боя',
    characters: 'Листы персонажей',
} as const;

export default function Footer() {
    return(
        <footer className={styles.footerContainer}>
            <div className={styles.footerWrapper}>
                <div className={styles.footer}>
                    <div className={styles.brandColumn}>
                        <div className={styles.flex}>
                            <img src={Logo} alt="Logo" className={styles.logo}/>
                            <p>{FOOTER_TEXT.brand}</p>
                        </div>
                        <p className={styles.description}>{FOOTER_TEXT.description}</p>
                    </div>

                    <div className={styles.linksColumn}>
                        <Link to="/patch_notes">
                            {FOOTER_TEXT.patchNotes}
                        </Link>
                        <Link to="/battle_tracker">
                            {FOOTER_TEXT.battleTracker}
                        </Link>
                        <Link to="/character_list">
                            {FOOTER_TEXT.characters}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
