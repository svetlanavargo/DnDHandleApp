import { TextClasses } from '../../../constants/TextClasses.ts';
import { TextSubClasses } from '../../../constants/TextSubClasses.ts';
import { TextRace } from '../../../constants/TextRaces.ts';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './ListHeader.module.css';

interface ListHeaderProps {
    name: string,
    level: number,
    race: string,
    spec: string,
    charSubclass?: string,
    onEdit: () => void
    longRest: () => void
}

function ListHeader({name, level, race, spec, charSubclass, onEdit, longRest}: ListHeaderProps) {
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
                    <div>
                        <div className={styles.flex}>
                            <p className={styles.race}>{TextRace[race]}</p>
                            <p>{TextClasses[spec]}</p>
                        </div>
                        <div className={styles.charSubclass}>{TextSubClasses[spec]?.[charSubclass]}</div>
                    </div>
                </div>
            </div>
            <Btn onClick={longRest} classBtn='reset'/>
        </div>
    )
}

export default ListHeader;