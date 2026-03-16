import { textLanguages } from '../../../constants/languages.ts';
import styles from './DomainField.module.css';

interface LanguageProps {
    lang: string[]
}

function DomainField({lang}: LanguageProps) {
    return (
        <div className={styles.domainFieldContainer}>
            <div className={styles.domainFieldWrapper}>
                {lang.map(el => (
                    <div>
                        {textLanguages[el]}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DomainField;