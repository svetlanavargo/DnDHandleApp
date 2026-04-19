import { useState } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader.tsx';
import FormToggle from '../FormToggle/FormToggle.tsx';
import styles from './Feedback.module.css';

export default function Feedback() {
    const [activeForm, setActiveForm] = useState<'feedback' | 'report'>('feedback');

    return(
        <div className={styles.feedbackContainer}>
            <div className={styles.feedbackWrapper}>
                <SectionHeader
                    title="Поделись впечатлениями или отправь баг-репорт"
                    subtitle="Обратная связь"
                />
                <FormToggle
                    activeForm={activeForm}
                    onChange={setActiveForm}
                />
            </div>
        </div>
    )
}
