import type { Spell } from '../../../types/dnd.ts'
import type { CSSProperties } from 'react';
import styles from './SpellCard.module.css';

interface SpellCardProps {
    fill: string,
    spell: Spell,
    style?: CSSProperties;
    size?: 'small' | 'big';
    isAdded?: boolean | undefined
}

const sizeClasses = {
    big: {
        card: styles.spellCardBig,
        flex: styles.flexBig,
        level: styles.levelBig,
        left: styles.leftBig,
        right: styles.rightBig,
        title: styles.titleBig,
        time: styles.timeBig,
        components: styles.componentsBig,
        distant: styles.distantBig,
        duration: styles.durationBig,
        description: styles.descriptionBig,
    },
    small: {
        card: styles.spellCardSmall,
        flex: styles.flexSmall,
        level: styles.levelSmall,
        left: styles.leftSmall,
        right: styles.rightSmall,
        title: styles.titleSmall,
        time: styles.timeSmall,
        components: styles.componentsSmall,
        distant: styles.distantSmall,
        duration: styles.durationSmall,
        description: styles.descriptionSmall,
    }
} as const;

function SpellCard({fill, spell, size = 'big', style}: SpellCardProps) {
    const s = sizeClasses[size];

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

    return (
        <div className={`${styles.spellCard} ${getFillClass(fill)} ${s.card}`} style={style}>
            <div className={s.level}>{String(spell.lvl)}</div>

            <a className={s.title} href={spell.url} target="_blank">
                {spell.nameRu}
            </a>

            <div className={s.flex}>
                <div className={s.left}>
                    <p className={s.time}>{spell.time}</p>
                    <p className={s.components}>{spell.components}</p>
                </div>

                <div className={s.right}>
                    <p className={s.distant}>{spell.distant}</p>
                    <p className={s.duration}>{spell.duration}</p>
                </div>
            </div>

            <p className={s.description}>
                {formatDescription(spell.description)}
            </p>
        </div>
    );
}

export default SpellCard