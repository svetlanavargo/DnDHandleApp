import { memo } from 'react';
import { TextLanguages } from '../../../constants/TextLanguages.ts';
import { TextArmors } from '../../../constants/TextArmors.ts';
import { TextWeapons } from '../../../constants/TextWeapons.ts';
import { TextTools } from '../../../constants/TextTools.ts';
import styles from './DomainField.module.css';

interface LanguageProps {
    lang: string[],
    armors: string[],
    weapons: string[],
    tools: string[],
    expertise: string[]
}

const THIEVES_TOOLS_KEY = 'thievesTools';

function DomainField({ lang, armors, tools, weapons, expertise }: LanguageProps) {
    const hasThievesToolsExpertise = expertise.includes(THIEVES_TOOLS_KEY);

    return (
        <div className={styles.domainFieldContainer}>
            <div className={styles.domainFieldWrapper}>
                <div className={styles.lang}>
                    <p className={styles.header}>оружие/доспехи</p>
                    {weapons.map(el => (
                        <div key={el} className={styles.text}>
                            {TextWeapons[el]}
                        </div>
                    ))}
                    {armors.map(el => (
                        <div key={el} className={styles.text}>
                            {TextArmors[el]}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.domainFieldWrapper}>
                <div className={styles.lang}>
                    <p className={styles.header}>Языки</p>
                    {lang.map(el => (
                        <div key={el} className={styles.text}>
                            {TextLanguages[el]}
                        </div>
                    ))}
                </div>
            </div>
            {tools.length > 0 && (
                <div className={styles.domainFieldWrapper}>
                    <div className={styles.lang}>
                        <p className={styles.header}>Инструменты</p>
                        {tools.map(el => (
                            <div
                                key={el}
                                className={`${styles.text} ${el === THIEVES_TOOLS_KEY && hasThievesToolsExpertise ? styles.textWithExpertise : ''}`}
                            >
                                <span>{TextTools[el]}</span>
                                {el === THIEVES_TOOLS_KEY && hasThievesToolsExpertise && (
                                    <span className={styles.expertiseImg} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(DomainField);
