import Btn from '../../UI/Btn/Btn.tsx';
import styles from './Field.module.css';

interface Roll {
    value: number
    magnitude: number | 'manual',
    type?: 'plus' | 'minus'
}

interface Props {
    total: number,
    history: Roll[],
    onReset: () => void,
    onInc: () => void,
    onDec: () => void
}

function Field({total, history, onReset, onInc, onDec}: Props) {
    const hasTotal = total > 0;

    return (
        <div className={styles.container}>
            <div className={styles.history}>
                {history.slice().reverse().map((roll, index) => {
                    let imgName

                    if (roll.magnitude === 'manual') {
                        imgName = roll.type === 'plus' ? 'plus' : 'minus'
                    } else if (roll.magnitude === 100) {
                        imgName = 'd10'
                    } else {
                        imgName = `d${roll.magnitude}`
                    }

                    return (
                        <div key={index} className={styles.historyWrapper}>
                            <img className={styles.historyImg} src={`../img/${imgName}.svg`} alt=''/>
                            <span className={styles.historyRollValue}>{roll.value}</span>
                        </div>
                    )
                })}
            </div>
            <div className={styles.totalHandler}>
                {hasTotal && <Btn onClick={onDec} classBtn='minus'/>}
                <div className={styles.total}>
                    <span>{total}</span>
                </div>
                {hasTotal && <Btn onClick={onInc} classBtn='plus'/>}
            </div>

            {hasTotal && <Btn onClick={onReset} classBtn='resetDice'/>}
        </div>
    )
}

export default Field