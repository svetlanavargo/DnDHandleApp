import Btn from '../../UI/Btn/Btn.tsx';
import styles from './NoGames.module.css';

interface NoSpellProps {
    onAdd?: () => void;
}

function NoGames({ onAdd }: NoSpellProps) {
    return(
        <div className={styles.noGamesContainer}>
            <div className={styles.img}/>
            <h2 className={styles.noGameTitle}>Уважаемый мастер!</h2>
            <p className={styles.noGameText}>Благодарим Вас за вашу работу! <br/> Для создания новой игры нажмите</p>
            <Btn onClick={onAdd} classBtn='addHits'/>
        </div>
    )
}

export default NoGames;