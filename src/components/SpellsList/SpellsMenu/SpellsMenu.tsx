import Btn from '../../UI/Btn/Btn.tsx';
import styles from './SpellsMenu.module.css';

interface SpellsMenuProps {
    onAdd: () => void;
    onDelete: () => void;
    onSettings: () => void;
}

function SpellsMenu({onAdd, onDelete, onSettings}: SpellsMenuProps) {
    return(
        <div className={styles.spellsMenuContainer}>
            <Btn onClick={onAdd} classBtn='addHits'/>
            <Btn onClick={onDelete} classBtn='subtractHits'/>
            <Btn onClick={onSettings} classBtn='settings'/>
        </div>
    )
}

export default SpellsMenu;