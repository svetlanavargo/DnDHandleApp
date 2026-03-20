import { useState, useEffect, useRef } from 'react';
import Logo from '../UI/Logo/Logo.tsx';
import BurgerMenu from '../UI/Burger/Burger.tsx';
import styles from './Header.module.css';
import {Link} from 'react-router-dom';

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.header}>
            <div className={styles.burgerContainer}>
                <BurgerMenu isOpen={isOpen} toggleMenu={toggleMenu}>
                    <Link to="/dice" onClick={() => setIsOpen(false)}>Дайсы</Link>
                    <Link to="/character_list" onClick={() => setIsOpen(false)}>Персонажи</Link>
                    <Link to="/inventory" onClick={() => setIsOpen(false)}>Инвентарь</Link>
                    <Link to="/spells_list" onClick={() => setIsOpen(false)}>Заклинания</Link>
                    <Link to="/battle_tracker" onClick={() => setIsOpen(false)}>ДМ Трекер</Link>
                </BurgerMenu>
            </div>
            <div className={styles.logoWrapper}>
                <Logo />
            </div>
            <div className={styles.null}/>
        </div>
    )
}

export default Header