import { TextLanguages } from '../../../constants/TextLanguages.ts';
import { TextArmors } from '../../../constants/TextArmors.ts';
import { TextWeapons } from '../../../constants/TextWeapons.ts';
import { TextTools } from '../../../constants/TextTools.ts';
import styles from './DomainField.module.css';

interface LanguageProps {
    lang: string[],
    armors: string[],
    weapons: string[],
    tools: string[]
}

function DomainField({ lang, armors, tools, weapons }: LanguageProps) {
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
                            <div key={el} className={styles.text}>
                                {TextTools[el]}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DomainField;