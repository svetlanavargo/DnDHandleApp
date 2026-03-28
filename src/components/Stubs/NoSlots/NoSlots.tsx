import { classesData } from '../../../constants/classesData.ts';
import ClassIcon from '../../UI/ClassIcon/ClassIcon.tsx';
import styles from './NoSlots.module.css';
import type {ClassKey} from "../../../types/dnd.ts";

interface NoSlotsProps {
    chClass: ClassKey
}

function NoSlots({chClass}:NoSlotsProps) {
    return(
        <div className={styles.noSlotsContainer}>
            <ClassIcon spec={chClass} size='big'/>
            <div className={styles.text}>
                <p>К сожалению (или к счастью?) твой персонаж
                    <span className={styles.classText}> {classesData[chClass].name} </span>
                      не может использовать заклинания
                </p>
            </div>
        </div>
    )
}

export default NoSlots;