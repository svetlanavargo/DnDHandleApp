import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/auth/useAuth';
import Input from '../UI/Input/Input';
import Btn from '../UI/Btn/Btn';
import styles from './AuthPage.module.css';

interface AuthPageProps {
    pageType: 'register' | 'login';
}

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
                <div className={styles.img}></div>
                <h2>
                    {pageType === 'login' ? 'Вход' : 'Регистрация'}
                </h2>

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <Input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="on"
                    />

                    <Input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="on"
                    />
                    <div className={styles.switch}>
                        {pageType === 'login' ? (
                            <p>
                                Нет аккаунта?{' '}
                                <span className={styles.link} onClick={() => navigate('/register')}>
                                    Зарегистрироваться
                                </span>
                            </p>
                        ) : (
                            <p>
                                Уже есть аккаунт?{' '}
                                <span className={styles.link} onClick={() => navigate('/login')}>
                                    Войти
                                </span>
                            </p>
                        )}
                    </div>
                    <Btn
                        type="submit"
                        disabled={loading}
                        classBtn="btnColor"
                    >
                        {loading
                            ? pageType === 'login'
                                ? 'Вхожу...'
                                : 'Регистрирую...'
                            : pageType === 'login'
                                ? 'Войти'
                                : 'Зарегистрироваться'}
                    </Btn>

                    {error && (
                        <p className={styles.errorText}>{error}</p>
                    )}
                </form>
            </div>
        </div>
    );
}
