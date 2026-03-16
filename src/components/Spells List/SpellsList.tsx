import Tracker from './Tracker/Tracker.tsx';
import styles from './SpellsList.module.css';

function SpellsList() {
    return(
        <div className={styles.spellsContainer}>
            ...
            <Tracker/>
        </div>
    )
}

export default SpellsList