import {useState} from 'react';
import DiceContainer from './DiceContainer/DiceContainer.tsx';
import Field from './Field/Field.tsx';
import DiceItem from './DiceItem/DiceItem.tsx';
import styles from './Dice.module.css';

interface Roll {
    magnitude: number | 'manual',
    value: number,
    type?: 'plus' | 'minus'
}

const dices:number[] = [2, 4, 6, 8, 10, 12, 20, 100]

function Dice() {
    const [diceCounts, setDiceCounts] = useState<{ [key: number]: number }>({});
    const [total, setTotal] = useState(0)
    const [rollHistory, setRollHistory] = useState<Roll[]>([])

    const handleRoll = (magnitude: number, value: number) => {
        setTotal(prev => prev + value)
        setRollHistory(prev => [...prev, {magnitude, value}])
        setDiceCounts(prev => ({
            ...prev,
            [magnitude]: (prev[magnitude] || 0) + 1
        }));
    }

    const handleReset = () => {
        setTotal(0);
        setRollHistory([]);
        setDiceCounts({});
    }

    const handleIncrement = () => {
        setTotal(prev => prev + 1);
        setRollHistory(prev => [...prev, { magnitude: 'manual', value: 1, type: 'plus' }])
    }

    const handleDecrement = () => {
        setTotal(prevTotal => {
            return prevTotal - 1;
        });
        setRollHistory(prevHistory => {
            if (total <= 1) {
                setDiceCounts({});
                return [];
            }
            return [...prevHistory, { magnitude: 'manual', value: 1, type: 'minus' }];
        })
    }

    return (
        <div className={styles.diceContainer}>
            <div className={styles.dice}>
                <Field
                    total={total}
                    history={rollHistory}
                    onReset={handleReset}
                    onInc={handleIncrement}
                    onDec={handleDecrement}
                />
                <DiceContainer>
                    {dices.map((dice:number) => (
                        <DiceItem key={dice}
                                  magnitude={dice}
                                  onRoll={handleRoll}
                                  clickCount={diceCounts[dice] || 0}
                        />
                    ))}
                </DiceContainer>
            </div>
        </div>
    )
}

export default Dice