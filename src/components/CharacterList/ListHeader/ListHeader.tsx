import { classesData } from '../../../constants/classesData.ts';
import { TextSubClasses } from '../../../constants/TextSubClasses.ts';
import { racesData } from '../../../constants/racesData.ts';
import type { ClassKey } from '../../../types/dnd';
import type { RaceKey } from '../../../types/dnd';
import Btn from '../../UI/Btn/Btn.tsx';
import styles from './ListHeader.module.css';

interface ListHeaderProps {
    name: string;
    level: number;
    race: RaceKey;
    spec: ClassKey;
    charSubclass?: string;
    onEdit: () => void;
    longRest: () => void;
}

function ListHeader({
                        name,
                        level,
                        race,
                        spec,
                        charSubclass,
                        onEdit,
                        longRest
                    }: ListHeaderProps) {
    return (
        <div className={styles.listHeader}>
            <div className={styles.flex}>
                <div className={styles[spec]} />
                <div>
                    <div className={styles.flex}>
                        <h3 className={styles.name}>{name}</h3>
                        <div className={styles.level}>{level}</div>
                        <Btn onClick={onEdit} classBtn="edit" />
                    </div>
                    <div>
                        <div className={styles.flex}>
                            <a className={styles.link} href={racesData[race]?.url} target='_blank'>
                                {racesData[race]?.name}
                            </a>
                            <a className={styles.link} href={classesData[spec].url} target='_blank'>
                                {classesData[spec].name}
                            </a>
                        </div>
                        <div className={styles.charSubclass}>
                            {charSubclass ? TextSubClasses[spec]?.[charSubclass] : ''}
                        </div>
                    </div>
                </div>
            </div>
            <Btn onClick={longRest} classBtn="reset" />
        </div>
    );
}

export default ListHeader;