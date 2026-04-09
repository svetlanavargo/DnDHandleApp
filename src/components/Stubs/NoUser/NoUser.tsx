import Btn from '../../UI/Btn/Btn.tsx';
import styles from './NoUser.module.css';

interface NoSpellProps {
    onAdd?: () => void;
}

function NoUser({ onAdd }: NoSpellProps) {
    return(
        <div className={styles.noGamesContainer}>
            <div className={styles.img}/>
            <h2 className={styles.noGameTitle}>Привет игрок!</h2>
            <p className={styles.noGameText}>Для создания листа персонажа нажми</p>
            <Btn onClick={onAdd} classBtn='addHits'/>
        </div>
    )
}

export default NoUser;