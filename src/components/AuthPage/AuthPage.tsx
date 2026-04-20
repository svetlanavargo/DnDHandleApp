import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/auth/useAuth';
import Input from '../UI/Input/Input';
import Btn from '../UI/Btn/Btn';
import styles from './AuthPage.module.css';

interface AuthPageProps {
    pageType: 'register' | 'login';
}

const AUTH_PAGE_TEXT = {
    login: {
        subtitle: 'С возвращением',
        title: 'Войди и продолжи кампанию с того же места',
        description:
            'Сохраняй персонажей, инвентарь, заклинания и состояние боя между устройствами и сессиями.',
        heading: 'Вход',
        submitIdle: 'Войти',
        submitLoading: 'Вхожу...',
        switchLead: 'Нет аккаунта?',
        switchAction: 'Зарегистрироваться',
        points: [
            'Синхронизация данных между устройствами',
            'Безопасное хранение персонажей и игр',
            'Быстрый доступ к трекеру боя и листам',
        ],
    },
    register: {
        subtitle: 'Новый аккаунт',
        title: 'Создай профиль и сохраняй всё, что происходит в партии',
        description:
            'Регистрация нужна, чтобы данные не исчезали после перезагрузки и были доступны в любом браузере.',
        heading: 'Регистрация',
        submitIdle: 'Зарегистрироваться',
        submitLoading: 'Регистрирую...',
        switchLead: 'Уже есть аккаунт?',
        switchAction: 'Войти',
        points: [
            'История персонажей и заметок сохраняется',
            'Игры и карты боя не теряются после обновления страницы',
            'Один аккаунт для всех инструментов приложения',
        ],
    },
    emailLabel: 'Email',
    passwordLabel: 'Пароль',
    emailPlaceholder: 'name@email.com',
    passwordPlaceholder: 'Минимум 1 пароль, максимум одна драма',
} as const;

function getAuthErrorMessage(error: unknown, pageType: AuthPageProps['pageType']) {
    const rawMessage = error instanceof Error
        ? error.message
        : typeof error === 'string'
            ? error
            : '';

    const normalizedMessage = rawMessage.trim();
    const upperMessage = normalizedMessage.toUpperCase();
    const lowerMessage = normalizedMessage.toLowerCase();

    const authErrorMap: Record<string, string> = {
        INVALID_CREDENTIALS: 'Неверный email или пароль.',
        INVALID_EMAIL_OR_PASSWORD: 'Неверный email или пароль.',
        UNAUTHORIZED: 'Неверный email или пароль.',
        USER_NOT_FOUND: 'Пользователь с таким email не найден.',
        EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже зарегистрирован.',
        USER_ALREADY_EXISTS: 'Пользователь с таким email уже зарегистрирован.',
        EMAIL_TAKEN: 'Пользователь с таким email уже зарегистрирован.',
        INVALID_EMAIL: 'Введите корректный email.',
        WEAK_PASSWORD: 'Пароль слишком простой. Используйте более надёжный пароль.',
        PASSWORD_TOO_SHORT: 'Пароль слишком короткий.',
        NETWORK_ERROR: 'Не удалось связаться с сервером. Попробуйте ещё раз.',
    };

    if (upperMessage in authErrorMap) {
        return authErrorMap[upperMessage];
    }

    if (
        lowerMessage.includes('network request failed') ||
        lowerMessage.includes('failed to fetch')
    ) {
        return 'Не удалось связаться с сервером. Проверь подключение и попробуй ещё раз.';
    }

    if (
        lowerMessage.includes('already exists') ||
        lowerMessage.includes('already registered') ||
        lowerMessage.includes('email taken')
    ) {
        return 'Пользователь с таким email уже зарегистрирован.';
    }

    if (
        lowerMessage.includes('invalid credentials') ||
        lowerMessage.includes('invalid email or password') ||
        lowerMessage.includes('wrong password') ||
        lowerMessage.includes('unauthorized')
    ) {
        return 'Неверный email или пароль.';
    }

    if (
        lowerMessage.includes('invalid email') ||
        (lowerMessage.includes('email') && lowerMessage.includes('invalid'))
    ) {
        return 'Введите корректный email.';
    }

    if (
        lowerMessage.includes('weak password') ||
        lowerMessage.includes('password too short') ||
        (lowerMessage.includes('password') && lowerMessage.includes('short'))
    ) {
        return 'Пароль слишком короткий или простой.';
    }

    return pageType === 'login'
        ? 'Не удалось выполнить вход. Проверь данные и попробуй ещё раз.'
        : 'Не удалось завершить регистрацию. Проверь данные и попробуй ещё раз.';
}

export default function AuthPage({ pageType }: AuthPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { login, register } = useAuth();
    const pageText = AUTH_PAGE_TEXT[pageType];

    useEffect(() => {
        setError(null);
    }, [pageType]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            if (pageType === 'login') {
                await login(email, password);
                navigate('/');
            } else {
                await register(email, password);
                navigate('/login');
            }
        } catch (err: unknown) {
            setError(getAuthErrorMessage(err, pageType));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.authWrapper}>
                <section className={styles.hero}>
                    <p className={styles.subtitle}>{pageText.subtitle}</p>
                    <h1 className={styles.title}>{pageText.title}</h1>
                    <p className={styles.description}>{pageText.description}</p>

                    <div className={styles.pointsList}>
                        {pageText.points.map((point) => (
                            <div key={point} className={styles.pointCard}>
                                <span className={styles.pointMark} aria-hidden="true" />
                                <span className={styles.pointText}>{point}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <div className={styles.brandRow}>
                            <div className={styles.img}></div>
                            <div>
                                <p className={styles.brandName}>DnD App</p>
                                <h2 className={styles.formTitle}>{pageText.heading}</h2>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        <Input
                            type="email"
                            placeholder={AUTH_PAGE_TEXT.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="on"
                        >
                            {AUTH_PAGE_TEXT.emailLabel}
                        </Input>

                        <Input
                            type="password"
                            placeholder={AUTH_PAGE_TEXT.passwordPlaceholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="on"
                        >
                            {AUTH_PAGE_TEXT.passwordLabel}
                        </Input>

                        <div className={styles.switch}>
                            <p className={styles.switchText}>
                                {pageText.switchLead}{' '}
                                <span
                                    className={styles.link}
                                    onClick={() => navigate(pageType === 'login' ? '/register' : '/login')}
                                >
                                    {pageText.switchAction}
                                </span>
                            </p>
                        </div>

                        <Btn
                            type="submit"
                            disabled={loading}
                            classBtn="btnColor"
                        >
                            {loading ? pageText.submitLoading : pageText.submitIdle}
                        </Btn>

                        {error && (
                            <p className={styles.errorText}>{error}</p>
                        )}
                    </form>
                </section>
            </div>
        </div>
    );
}
