import styles from './Offer.module.css';
import d4Image from '../../../assets/img/MainPage/3DDices/d4.png';
import d6Image from '../../../assets/img/MainPage/3DDices/d6.png';
import d8Image from '../../../assets/img/MainPage/3DDices/d8.png';
import d10Image from '../../../assets/img/MainPage/3DDices/d10.png';
import d12Image from '../../../assets/img/MainPage/3DDices/d12.png';
import d20Image from '../../../assets/img/MainPage/3DDices/d20.png';
import d100Image from '../../../assets/img/MainPage/3DDices/d100.png';

const OFFER_TEXT = {
    eyebrow: 'DnD App',
    title: 'Менеджер персонажей и трекер боя для живых DnD-сессий',
    description:
        'Храни персонажей, веди инициативу, следи за эффектами и не теряй темп игры, пока кубы делают своё дело.',
} as const;

const DICE_ITEMS = [
    { src: d20Image, alt: 'D20', className: 'diceD20', side: 'left' },
    { src: d12Image, alt: 'D12', className: 'diceD12', side: 'left' },
    { src: d10Image, alt: 'D10', className: 'diceD10', side: 'left' },
    { src: d8Image, alt: 'D8', className: 'diceD8', side: 'right' },
    { src: d6Image, alt: 'D6', className: 'diceD6', side: 'right' },
    { src: d4Image, alt: 'D4', className: 'diceD4', side: 'right' },
    { src: d100Image, alt: 'D100', className: 'diceD100', side: 'right' },
] as const;

export default function Offer() {
    return(
        <section className={styles.offer}>
            <div className={styles.offerInner}>
                <div className={`${styles.diceColumn} ${styles.leftColumn}`} aria-hidden="true">
                    {DICE_ITEMS.filter((dice) => dice.side === 'left').map((dice) => (
                        <img
                            key={dice.alt}
                            src={dice.src}
                            alt={dice.alt}
                            className={`${styles.dice} ${styles[dice.className]}`}
                        />
                    ))}
                </div>

                <div className={styles.offerText}>
                    <p className={styles.eyebrow}>{OFFER_TEXT.eyebrow}</p>
                    <h1 className={styles.offerHeader}>{OFFER_TEXT.title}</h1>
                    <p className={styles.offerDesc}>{OFFER_TEXT.description}</p>
                </div>

                <div className={`${styles.diceColumn} ${styles.rightColumn}`} aria-hidden="true">
                    {DICE_ITEMS.filter((dice) => dice.side === 'right').map((dice) => (
                        <img
                            key={dice.alt}
                            src={dice.src}
                            alt={dice.alt}
                            className={`${styles.dice} ${styles[dice.className]}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
