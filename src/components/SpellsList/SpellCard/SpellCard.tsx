import type { Spell } from '../../../types/dnd.ts'
import styles from './SpellCard.module.css';

interface SpellCardProps {
    fill: string,
    spell: Spell,
}

function SpellCard({fill, spell}: SpellCardProps) {
    const getFillClass = (fill: string) => {
        switch (fill) {
            case 'bard':
                return styles.cardFillBard;
            case 'cleric':
                return styles.cardFillCleric;
            case 'druid':
                return styles.cardFillDruid;
            case 'paladin':
                return styles.cardFillPaladin;
            case 'ranger':
                return styles.cardFillRanger;
            case 'sorcerer':
                return styles.cardFillSorcerer;
            case 'warlock':
                return styles.cardFillWarlock;
            case 'wizard':
                return styles.cardFillWizard;
            default:
                return styles.cardFillSorcerer;
        }
    };

    const formatDescription = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\n)/g);

        return parts.map((part, index) => {
            if (part === '\n') {
                return <br key={index} />;
            }

            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <span key={index} className={styles.color}>
                        {part.slice(2, -2)}
                    </span>
                );
            }

            return part;
        });
    };

    return(
        <div className={`${styles.spellCard} ${getFillClass(fill)}`}>
            <div className={styles.level}>{spell.lvl}</div>
            <a className={styles.title} href={spell.url} target='_blank'>{spell.nameRu}</a>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <p className={styles.time}>{spell.time}</p>
                    <p className={styles.components}>{spell.components}</p>
                </div>
                <div className={styles.right}>
                    <p className={styles.distant}>{spell.distant}</p>
                    <p className={styles.duration}>{spell.duration}</p>
                </div>
            </div>
            <p className={styles.description}>
                {formatDescription(spell.description)}
            </p>
        </div>
    )
}

export default SpellCard