import { memo } from 'react';
import { classesData } from '../../../constants/classesData.ts';
import { SubclassesData } from '../../../constants/subclassesData.ts';
import { racesData } from '../../../constants/racesData.ts';
import { SubracesData } from "../../../constants/subracesData.ts";
import type { ClassKey } from '../../../types/dnd';
import type { RaceKey } from '../../../types/dnd';
import Btn from '../../UI/Btn/Btn.tsx';
import ClassIcon from '../../UI/ClassIcon/ClassIcon.tsx';
import styles from './ListHeader.module.css';

interface ListHeaderProps {
    name: string;
    level: number;
    race: RaceKey;
    subrace?: string;
    spec: ClassKey;
    charSubclass?: string;
    onEdit: () => void;
    longRest: () => void;
}

function ListHeader({
                        name,
                        level,
                        race,
                        subrace,
                        spec,
                        charSubclass,
                        onEdit,
                        longRest
                    }: ListHeaderProps) {
    return (
        <div className={styles.listHeader}>
            <div className={styles.flex}>
                <ClassIcon spec={spec} size='small'/>
                <div className={styles.margin}>
                    <div className={styles.flex}>
                        <h3 className={styles.name}>{name}</h3>
                        <div className={styles.level}>{level}</div>
                        <Btn onClick={onEdit} classBtn="edit" />
                    </div>
                    <div>
                        <div className={styles.flex}>
                            <a className={styles.link} href={racesData[race]?.url} target='_blank'>
                                {subrace
                                    ? SubracesData[race]?.[subrace] ?? racesData[race]?.name
                                    : racesData[race]?.name}
                            </a>
                            <a className={styles.link} href={classesData[spec].url} target='_blank'>
                                {classesData[spec].name}
                            </a>
                        </div>
                        <div className={styles.charSubclass}>
                            {charSubclass ? SubclassesData[spec]?.[charSubclass] : ''}
                        </div>
                    </div>
                </div>
            </div>
            <Btn onClick={longRest} classBtn="reset" />
        </div>
    );
}

export default memo(ListHeader);
