import {Link} from 'react-router-dom';
import styles from './NoCharacter.module.css';

interface NoCharacterProps {
    text: string
}

function NoCharacter({text}:NoCharacterProps) {
    return(
        <div className={styles.noCharContainer}>
            <div className={styles.img}/>
            <p className={styles.text}>{text}
                <Link to="/character_list"> создать персонажа</Link>
            </p>
        </div>
    )
}

export default NoCharacter;