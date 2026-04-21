import { useEffect, useState } from 'react';
import patchNotes from '../../data/PatchNotesData/PatchNotes.json';
import FormToggle from '../MainPage/FormToggle/FormToggle.tsx';
import styles from './PatchNotes.module.css';

type PatchNoteType = 'bug' | 'feature';

type PatchNote = {
    type: PatchNoteType;
    date: string;
    title: string;
    description: string;
    solved: boolean;
};

const PATCH_NOTE_TEXT = {
    subtitle: 'Журнал изменений',
    title: 'Что мы уже поправили и что еще в работе',
    description: 'Здесь собраны найденные баги, новые фичи и статус их внедрения.',
    feature: 'Фича',
    bug: 'Баг',
    solved: 'Исправлено',
    added: 'Добавлено',
    inProgress: 'В работе',
    total: 'Всего записей',
    fixed: 'Закрыто',
    active: 'Открыто',
    features: 'Новых фич',
    bugs: 'Найдено багов',
    latest: 'Последнее обновление',
    empty: 'Пока здесь пусто. Как только в JSON появятся записи, они сразу отрисуются на этой странице.',
    feedbackSubtitle: 'Обратная связь',
    feedbackTitle: 'Не находишь в списке баг или хочешь предложить улучшение?',
    feedbackDescription: 'Отправь баг-репорт или поделись идеей.',
} as const;

function getTypeLabel(type: PatchNoteType) {
    return type === 'feature'
        ? PATCH_NOTE_TEXT.feature
        : PATCH_NOTE_TEXT.bug;
}

function getStatusLabel(note: PatchNote) {
    if (!note.solved) {
        return PATCH_NOTE_TEXT.inProgress;
    }

    return note.type === 'feature'
        ? PATCH_NOTE_TEXT.added
        : PATCH_NOTE_TEXT.solved;
}

function getDateValue(date: string) {
    const [day, month, year] = date.split('.').map(Number);

    return new Date(year, month - 1, day).getTime();
}

export default function PatchNotes() {
    const [activeForm, setActiveForm] = useState<'feedback' | 'report'>('feedback');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });

        const root = document.getElementById('root');

        if (root) {
            root.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, []);

    const entries = [...(patchNotes as PatchNote[])].sort((left, right) => (
        getDateValue(right.date) - getDateValue(left.date)
    ));
    const fixedCount = entries.filter(note => note.solved).length;
    const activeCount = entries.length - fixedCount;
    const featureCount = entries.filter(note => note.type === 'feature').length;
    const bugCount = entries.length - featureCount;
    const latestDate = entries[0]?.date ?? '—';

    return(
        <div className={styles.patchNotesContainer}>
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <p className={styles.subtitle}>{PATCH_NOTE_TEXT.subtitle}</p>
                    <h1 className={styles.title}>{PATCH_NOTE_TEXT.title}</h1>
                    <p className={styles.description}>{PATCH_NOTE_TEXT.description}</p>
                </div>

                <div className={styles.overviewCard}>
                    <div className={styles.overviewHeader}>
                        <span className={styles.overviewEyebrow}>{PATCH_NOTE_TEXT.latest}</span>
                        <span className={styles.overviewDate}>{latestDate}</span>
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>{PATCH_NOTE_TEXT.total}</span>
                            <span className={styles.statValue}>{entries.length}</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>{PATCH_NOTE_TEXT.fixed}</span>
                            <span className={styles.statValue}>{fixedCount}</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>{PATCH_NOTE_TEXT.active}</span>
                            <span className={styles.statValue}>{activeCount}</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.featureStat}`}>
                            <span className={styles.statLabel}>{PATCH_NOTE_TEXT.features}</span>
                            <span className={styles.statValue}>{featureCount}</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.bugStat}`}>
                            <span className={styles.statLabel}>{PATCH_NOTE_TEXT.bugs}</span>
                            <span className={styles.statValue}>{bugCount}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.notesSection}>
                {entries.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>{PATCH_NOTE_TEXT.empty}</p>
                    </div>
                ) : (
                    entries.map((note, index) => (
                        <article
                            key={`${note.date}-${note.title}-${index}`}
                            className={`${styles.noteCard} ${note.type === 'bug' ? styles.bugCard : styles.featureCard}`}
                        >
                            <div className={styles.timelineAccent} />

                            <div className={styles.noteMeta}>
                                <span className={`${styles.typeBadge} ${note.type === 'bug' ? styles.bugBadge : styles.featureBadge}`}>
                                    {getTypeLabel(note.type)}
                                </span>
                                <span className={styles.dateBadge}>{note.date}</span>
                                <span className={`${styles.statusBadge} ${note.solved ? styles.solvedBadge : styles.activeBadge}`}>
                                    {getStatusLabel(note)}
                                </span>
                            </div>

                            <h2 className={styles.noteTitle}>{note.title}</h2>
                            <p className={styles.noteDescription}>{note.description}</p>
                        </article>
                    ))
                )}
            </section>

            <section className={styles.feedbackSection}>
                <div className={styles.feedbackIntro}>
                    <p className={styles.feedbackSubtitle}>{PATCH_NOTE_TEXT.feedbackSubtitle}</p>
                    <h2 className={styles.feedbackTitle}>{PATCH_NOTE_TEXT.feedbackTitle}</h2>
                    <p className={styles.feedbackDescription}>{PATCH_NOTE_TEXT.feedbackDescription}</p>
                </div>

                <FormToggle
                    activeForm={activeForm}
                    onChange={setActiveForm}
                />
            </section>
        </div>
    )
}
