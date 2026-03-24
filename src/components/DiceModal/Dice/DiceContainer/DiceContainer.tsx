import type {ReactNode} from 'react';
import styles from './DiceContainer.module.css';

interface Props {
    children: ReactNode
}

function DiceContainer({children}: Props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.containerDices}>
                {children}
            </div>
        </div>
    )
}

export default DiceContainer
