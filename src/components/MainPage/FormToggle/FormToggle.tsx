import { useMemo, useState } from 'react';
import Input from '../../UI/Input/Input.tsx';
import TextArea from '../../UI/Input/TextArea.tsx';
import Btn from '../../UI/Btn/Btn.tsx';
import { sendEmail } from '../../../api/emailjs.ts';
import styles from './FormToggle.module.css';

interface FormToggleProps {
    activeForm: 'feedback' | 'report';
    onChange: (form: 'feedback' | 'report') => void;
}

type FeedbackFormState = {
    name: string;
    email: string;
    message: string;
};

type ReportFormState = {
    name: string;
    email: string;
    page: string;
    bug: string;
    steps: string;
};

type FeedbackTouchedState = Record<keyof FeedbackFormState, boolean>;
type ReportTouchedState = Record<keyof ReportFormState, boolean>;
const MAX_FORM_FIELD_LENGTH = 1000;

// Меняй здесь тексты переключателя, заголовки формы и текст кнопок.
const FEEDBACK_TEXT = {
    feedback: {
        toggle: 'Обратная связь',
        badge: 'Отзыв',
        title: 'Расскажи, что понравилось или чего не хватает',
        description: 'Любая обратная связь помогает понять, что улучшать дальше.',
        submit: 'Отправить отзыв',
    },
    report: {
        toggle: 'Баг-репорт',
        badge: 'Ошибка',
        title: 'Опиши проблему как можно точнее',
        description: 'Укажи страницу, что произошло и как это воспроизвести.',
        submit: 'Отправить баг-репорт',
    }
} as const;

const FEEDBACK_INITIAL_STATE: FeedbackFormState = {
    name: '',
    email: '',
    message: '',
};

const REPORT_INITIAL_STATE: ReportFormState = {
    name: '',
    email: '',
    page: '',
    bug: '',
    steps: '',
};

const FEEDBACK_TOUCHED_INITIAL_STATE: FeedbackTouchedState = {
    name: false,
    email: false,
    message: false,
};

const REPORT_TOUCHED_INITIAL_STATE: ReportTouchedState = {
    name: false,
    email: false,
    page: false,
    bug: false,
    steps: false,
};

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value: string) {
    return value.trim().length === 0;
}

function limitFieldLength(value: string) {
    return value.slice(0, MAX_FORM_FIELD_LENGTH);
}

function getFeedbackErrors(values: FeedbackFormState) {
    return {
        name: isBlank(values.name) ? 'Укажи имя.' : '',
        email: isBlank(values.email)
            ? 'Укажи email.'
            : !EMAIL_REGEXP.test(values.email.trim())
                ? 'Введи корректный email.'
                : '',
        message: isBlank(values.message) ? 'Напиши сообщение.' : '',
    };
}

function getReportErrors(values: ReportFormState) {
    return {
        name: isBlank(values.name) ? 'Укажи имя.' : '',
        email: isBlank(values.email)
            ? 'Укажи email.'
            : !EMAIL_REGEXP.test(values.email.trim())
                ? 'Введи корректный email.'
                : '',
        page: isBlank(values.page)
            ? 'Укажи страницу.'
            : !values.page.trim().startsWith('/')
                ? 'Начни путь с /. Например: /inventory'
                : '',
        bug: isBlank(values.bug) ? 'Опиши проблему.' : '',
        steps: isBlank(values.steps) ? 'Опиши шаги воспроизведения.' : '',
    };
}

function hasErrors(errors: Record<string, string>) {
    return Object.values(errors).some(Boolean);
}

function getSubmitErrorMessage(error: unknown) {
    if (error instanceof Error && error.message === 'EMAILJS_NOT_CONFIGURED') {
        return 'EmailJS ещё не настроен. Добавь ключи в .env и template ID для обеих форм.';
    }

    if (typeof error === 'object' && error !== null) {
        const maybeStatus = 'status' in error ? error.status : null;
        const maybeText = 'text' in error ? error.text : null;

        if (typeof maybeStatus === 'number' && typeof maybeText === 'string') {
            return `EmailJS error ${maybeStatus}: ${maybeText}`;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return 'Не удалось отправить форму. Попробуй ещё раз.';
}

export default function FormToggle({ activeForm, onChange }: FormToggleProps) {
    const [feedbackForm, setFeedbackForm] = useState<FeedbackFormState>(FEEDBACK_INITIAL_STATE);
    const [reportForm, setReportForm] = useState<ReportFormState>(REPORT_INITIAL_STATE);
    const [feedbackTouched, setFeedbackTouched] = useState<FeedbackTouchedState>(FEEDBACK_TOUCHED_INITIAL_STATE);
    const [reportTouched, setReportTouched] = useState<ReportTouchedState>(REPORT_TOUCHED_INITIAL_STATE);
    const [submittedType, setSubmittedType] = useState<'feedback' | 'report' | null>(null);
    const [feedbackSubmitAttempted, setFeedbackSubmitAttempted] = useState(false);
    const [reportSubmitAttempted, setReportSubmitAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const currentText = useMemo(
        () => FEEDBACK_TEXT[activeForm],
        [activeForm]
    );

    const isFeedback = activeForm === 'feedback';
    const feedbackErrors = useMemo(() => getFeedbackErrors(feedbackForm), [feedbackForm]);
    const reportErrors = useMemo(() => getReportErrors(reportForm), [reportForm]);
    const isFeedbackValid = !hasErrors(feedbackErrors);
    const isReportValid = !hasErrors(reportErrors);

    async function handleFeedbackSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFeedbackSubmitAttempted(true);
        setSubmitError(null);

        if (!isFeedbackValid) {
            return;
        }

        try {
            setIsSubmitting(true);
            await sendEmail({
                type: 'feedback',
                ...feedbackForm,
            });
            setSubmittedType('feedback');
            setFeedbackForm(FEEDBACK_INITIAL_STATE);
            setFeedbackTouched(FEEDBACK_TOUCHED_INITIAL_STATE);
            setFeedbackSubmitAttempted(false);
        } catch (error) {
            setSubmitError(getSubmitErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleReportSubmit(e: React.FormEvent) {
        e.preventDefault();
        setReportSubmitAttempted(true);
        setSubmitError(null);

        if (!isReportValid) {
            return;
        }

        try {
            setIsSubmitting(true);
            await sendEmail({
                type: 'report',
                ...reportForm,
            });
            setSubmittedType('report');
            setReportForm(REPORT_INITIAL_STATE);
            setReportTouched(REPORT_TOUCHED_INITIAL_STATE);
            setReportSubmitAttempted(false);
        } catch (error) {
            setSubmitError(getSubmitErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleFeedbackChange<K extends keyof FeedbackFormState>(field: K, value: FeedbackFormState[K]) {
        setSubmittedType(null);
        setSubmitError(null);
        setFeedbackForm(prev => ({ ...prev, [field]: limitFieldLength(String(value)) }));
    }

    function handleFeedbackBlur(field: keyof FeedbackFormState) {
        setFeedbackTouched(prev => ({ ...prev, [field]: true }));
    }

    function handleReportChange<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]) {
        setSubmittedType(null);
        setSubmitError(null);
        setReportForm(prev => ({ ...prev, [field]: limitFieldLength(String(value)) }));
    }

    function handleReportBlur(field: keyof ReportFormState) {
        setReportTouched(prev => ({ ...prev, [field]: true }));
    }

    return(
        <div className={styles.formToggleContainer}>
            <div className={styles.togglePanel}>
                <button
                    type="button"
                    className={`${styles.toggleOption} ${isFeedback ? styles.toggleOptionActive : ''}`}
                    aria-pressed={isFeedback}
                    onClick={() => onChange('feedback')}
                >
                    <span className={styles.toggleBadge}>{FEEDBACK_TEXT.feedback.badge}</span>
                    <span className={styles.toggleTitle}>{FEEDBACK_TEXT.feedback.toggle}</span>
                    {/* Меняй короткое описание режима в переключателе здесь. */}
                    <span className={styles.toggleDescription}>Пожелания, идеи и общее впечатление от приложения.</span>
                </button>
                <button
                    type="button"
                    className={`${styles.toggleOption} ${!isFeedback ? styles.toggleOptionActive : ''}`}
                    aria-pressed={!isFeedback}
                    onClick={() => onChange('report')}
                >
                    <span className={styles.toggleBadge}>{FEEDBACK_TEXT.report.badge}</span>
                    <span className={styles.toggleTitle}>{FEEDBACK_TEXT.report.toggle}</span>
                    {/* Меняй короткое описание режима в переключателе здесь. */}
                    <span className={styles.toggleDescription}>Сообщение о поломке с шагами и страницей.</span>
                </button>
            </div>

            <div className={styles.formCard}>
                <div className={styles.formHeader}>
                    <p className={styles.formTitle}>{currentText.title}</p>
                    <p className={styles.formDescription}>{currentText.description}</p>
                </div>

                {submittedType === activeForm && (
                    // Меняй текст успешной отправки здесь.
                    <p className={styles.successMessage}>Форма отправлена.</p>
                )}
                {/* Меняй общий текст ошибки отправки здесь, если нужен другой tone of voice. */}
                {submitError && <p className={styles.submitError}>{submitError}</p>}

                {isFeedback ? (
                    <form className={styles.form} onSubmit={handleFeedbackSubmit} noValidate>
                        {/* Меняй состав полей формы обратной связи внутри этого блока. */}
                        <div className={styles.fieldsGrid}>
                            <div className={styles.field}>
                                <Input
                                    type="text"
                                    value={feedbackForm.name}
                                    maxLength={MAX_FORM_FIELD_LENGTH}
                                    onChange={(e) => handleFeedbackChange('name', e.target.value)}
                                    onBlur={() => handleFeedbackBlur('name')}
                                    placeholder="Как к тебе обращаться"
                                >
                                    Имя
                                </Input>
                                {(feedbackTouched.name || feedbackSubmitAttempted) && feedbackErrors.name && (
                                    <p className={styles.errorText}>{feedbackErrors.name}</p>
                                )}
                            </div>

                            <div className={styles.field}>
                                <Input
                                    type="email"
                                    value={feedbackForm.email}
                                    maxLength={MAX_FORM_FIELD_LENGTH}
                                    onChange={(e) => handleFeedbackChange('email', e.target.value)}
                                    onBlur={() => handleFeedbackBlur('email')}
                                    placeholder="name@email.com"
                                >
                                    Email
                                </Input>
                                {(feedbackTouched.email || feedbackSubmitAttempted) && feedbackErrors.email && (
                                    <p className={styles.errorText}>{feedbackErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <TextArea
                                value={feedbackForm.message}
                                maxLength={MAX_FORM_FIELD_LENGTH}
                                onChange={(e) => handleFeedbackChange('message', e.target.value)}
                                onBlur={() => handleFeedbackBlur('message')}
                                placeholder="Что понравилось, чего не хватает, что хотелось бы улучшить"
                            >
                                Сообщение
                            </TextArea>
                            {(feedbackTouched.message || feedbackSubmitAttempted) && feedbackErrors.message && (
                                <p className={styles.errorText}>{feedbackErrors.message}</p>
                            )}
                        </div>

                        <div className={styles.submitRow}>
                            <Btn type="submit" classBtn="btnColor" disabled={!isFeedbackValid || isSubmitting}>
                                {isSubmitting ? 'Отправляем...' : currentText.submit}
                            </Btn>
                        </div>
                    </form>
                ) : (
                    <form className={styles.form} onSubmit={handleReportSubmit} noValidate>
                        {/* Меняй состав полей баг-репорта внутри этого блока. */}
                        <div className={styles.fieldsGrid}>
                            <div className={styles.field}>
                                <Input
                                    type="text"
                                    value={reportForm.name}
                                    maxLength={MAX_FORM_FIELD_LENGTH}
                                    onChange={(e) => handleReportChange('name', e.target.value)}
                                    onBlur={() => handleReportBlur('name')}
                                    placeholder="Как к тебе обращаться"
                                >
                                    Имя
                                </Input>
                                {(reportTouched.name || reportSubmitAttempted) && reportErrors.name && (
                                    <p className={styles.errorText}>{reportErrors.name}</p>
                                )}
                            </div>

                            <div className={styles.field}>
                                <Input
                                    type="email"
                                    value={reportForm.email}
                                    maxLength={MAX_FORM_FIELD_LENGTH}
                                    onChange={(e) => handleReportChange('email', e.target.value)}
                                    onBlur={() => handleReportBlur('email')}
                                    placeholder="name@email.com"
                                >
                                    Email
                                </Input>
                                {(reportTouched.email || reportSubmitAttempted) && reportErrors.email && (
                                    <p className={styles.errorText}>{reportErrors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <Input
                                type="text"
                                value={reportForm.page}
                                maxLength={MAX_FORM_FIELD_LENGTH}
                                onChange={(e) => handleReportChange('page', e.target.value)}
                                onBlur={() => handleReportBlur('page')}
                                placeholder="Например: /character_list"
                            >
                                Страница
                            </Input>
                            {(reportTouched.page || reportSubmitAttempted) && reportErrors.page && (
                                <p className={styles.errorText}>{reportErrors.page}</p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <TextArea
                                value={reportForm.bug}
                                maxLength={MAX_FORM_FIELD_LENGTH}
                                onChange={(e) => handleReportChange('bug', e.target.value)}
                                onBlur={() => handleReportBlur('bug')}
                                placeholder="Что сломалось или работает не так"
                            >
                                Проблема
                            </TextArea>
                            {(reportTouched.bug || reportSubmitAttempted) && reportErrors.bug && (
                                <p className={styles.errorText}>{reportErrors.bug}</p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <TextArea
                                value={reportForm.steps}
                                maxLength={MAX_FORM_FIELD_LENGTH}
                                onChange={(e) => handleReportChange('steps', e.target.value)}
                                onBlur={() => handleReportBlur('steps')}
                                placeholder="1. Открыл страницу 2. Нажал кнопку 3. Получил ошибку"
                            >
                                Шаги воспроизведения
                            </TextArea>
                            {(reportTouched.steps || reportSubmitAttempted) && reportErrors.steps && (
                                <p className={styles.errorText}>{reportErrors.steps}</p>
                            )}
                        </div>

                        <div className={styles.submitRow}>
                            <Btn type="submit" classBtn="btnColor" disabled={!isReportValid || isSubmitting}>
                                {isSubmitting ? 'Отправляем...' : currentText.submit}
                            </Btn>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
