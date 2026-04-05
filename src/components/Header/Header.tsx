import {Link} from 'react-router-dom';
import Logo from '../UI/Logo/Logo.tsx';
import Home from '../../../public/img/home.svg';
import DiceImg from "../../../public/img/dnd.svg"
import ListImg from '../../../public/img/User.svg';
import Pouch from "../../../public/img/pouch.svg";
import Spells from "../../../public/img/spells.svg";
import Battle from '../../../public/img/battleUser.svg';
import styles from './Header.module.css';

interface HeaderProps {
    setIsDiceOpen: () => void
}

function Header({setIsDiceOpen}: HeaderProps) {
    return(
        <div className={styles.header}>
            <div className={styles.logoWrapper}>
                <Logo />
            </div>
            <div className={styles.linkContainer}>
                <Link to="/">
                    <div className={styles.wrapperLink}>
                        <img className={styles.icon} src={Home} alt=""/>
                        <p className={styles.menuText}>Главная</p>
                    </div>
                </Link>
                <div onClick={setIsDiceOpen}>
                    <div className={styles.wrapperLink}>
                        <img className={styles.icon} src={DiceImg} alt=""/>
                        <p className={styles.menuText}>Дайсы</p>
                    </div>
                </div>
                <Link to="/character_list">
                    <div className={styles.wrapperLink}>
                        <img className={styles.icon} src={ListImg} alt=""/>
                        <p className={styles.menuText}>Персонажи</p>
                    </div>
                </Link>
                <Link to="/inventory">
                    <div className={styles.wrapperLink}>
                        <img className={styles.icon} src={Pouch} alt=""/>
                        <p className={styles.menuText}>Инвентарь</p>
                    </div>
                </Link>
                <Link to="/spells_list">
                    <div className={styles.wrapperLink}>
                        <img className={styles.icon} src={Spells} alt=""/>
                        <p className={styles.menuText}>Заклинания</p>
                    </div>
                </Link>
                <Link to="/battle_tracker">
                    <div className={styles.wrapperLink}>
                        <img className={styles.icon} src={Battle} alt=""/>
                        <p className={styles.menuText}>ДМ Трекер</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Header