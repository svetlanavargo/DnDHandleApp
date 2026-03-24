import styles from './DiceItem.module.css'

interface Props {
    magnitude: number,
    onRoll: (magnitude: number, value: number) => void,
    clickCount: number
}

function DiceItem({ magnitude, onRoll, clickCount }: Props)  {
    const shapeClass = styles[`d${magnitude}`]

    const rollDice = (magnitude: number) => {
        const value = Math.floor(Math.random() * magnitude + 1)
        onRoll(magnitude, value)
    }

    return (
        <div className={styles.diceContainer}>
            <div className={`${styles.dice} ${shapeClass}`} onClick={() => rollDice(magnitude)}>
                {
                    clickCount > 0 ?
                        <span className={styles.clickCount}>{clickCount}</span> : null
                }
                <span>{magnitude}</span>
            </div>
        </div>
    )
}

export default DiceItem