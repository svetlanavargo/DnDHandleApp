import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth.ts';

import Logo from '../UI/Logo/Logo.tsx';
import Modal from '../Modals/Modal.tsx';
import Confirm from '../Modals/Confirm.tsx';

import Home from '../../assets/img/home.svg';
import DiceImg from '../../assets/img/dnd.svg';
import ListImg from '../../assets/img/User.svg';
import Pouch from '../../assets/img/pouch.svg';
import Spells from '../../assets/img/spells.svg';
import Battle from '../../assets/img/battleUser.svg';
import Login from '../../assets/img/login.svg';
import Logout from '../../assets/img/logout.svg';

import styles from './Header.module.css';

interface HeaderProps {
    setIsDiceOpen: () => void;
}

export default function Header({ setIsDiceOpen }: HeaderProps) {
    const { user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        {
            label: 'Главная',
            icon: Home,
            to: '/'
        },
        {
            label: 'Дайсы',
            icon: DiceImg,
            onClick: setIsDiceOpen
        },
        {
            label: 'Персонажи',
            icon: ListImg,
            to: '/character_list'
        },
        {
            label: 'Инвентарь',
            icon: Pouch,
            to: '/inventory'
        },
        {
            label: 'Заклинания',
            icon: Spells,
            to: '/spells_list'
        },
        {
            label: 'ДМ Трекер',
            icon: Battle,
            to: '/battle_tracker'
        }
    ];

    function renderItem(item: {
        label: string;
        icon: string;
        to?: string;
        onClick?: () => void;
    }) {
        const content = (
            <div className={styles.wrapperLink}>
                <img className={styles.icon} src={item.icon} alt="" />
                <p className={styles.menuText}>{item.label}</p>
            </div>
        );

        if (item.to) {
            return (
                <Link key={item.label} to={item.to}>
                    {content}
                </Link>
            );
        }

        return (
            <div key={item.label} onClick={item.onClick}>
                {content}
            </div>
        );
    }

    return (
        <div className={styles.header}>
            <div className={styles.logoWrapper}>
                <Logo />
            </div>

            <div className={styles.linkContainer}>
                <div className={styles.linkWrapper}>
                    {menuItems.map(renderItem)}
                </div>

                <div>
                    {user ? (
                        <div onClick={() => setIsLogoutModalOpen(true)} className={styles.wrapperLink}>
                            <img className={styles.icon} src={Logout} alt="" />
                            <p className={styles.menuText}>Выйти</p>
                        </div>
                    ) : (
                        <Link to="/login">
                            <div className={styles.wrapperLink}>
                                <img className={styles.icon} src={Login} alt="" />
                                <p className={styles.menuText}>Войти</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            {isLogoutModalOpen && (
                <Modal isOpen size="small">
                    <Confirm
                        onClose={() => setIsLogoutModalOpen(false)}
                        onConfirm={() => {
                            void logout();
                            setIsLogoutModalOpen(false);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}
