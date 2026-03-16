import { textSpec} from '../../../constants/classes.ts';
import { textRace} from '../../../constants/races.ts';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './ListHeader.module.css';

interface ListHeaderProps {
    name: string,
    level: number,
    race: string,
    spec: string,
    onEdit: () => void
    longRest: () => void
}

function ListHeader({name, level, race, spec, onEdit, longRest}: ListHeaderProps) {
    return(
        <div className={styles.listHeader}>
            <div className={styles.flex}>
                <div className={styles[spec]}/>
                <div>
                    <div className={styles.flex}>
                        <h3 className={styles.name}>{name}</h3>
                        <div className={styles.level}>{level}</div>
                        <Btn onClick={onEdit} classBtn='edit'/>
                    </div>
                    <div className={styles.flex}>
                        <p className={styles.race}>{textRace[race]}</p>
                        <p>{textSpec[spec]}</p>
                    </div>
                </div>
            </div>
            <Btn onClick={longRest} classBtn='reset'/>
        </div>
    )
}

export default ListHeader;