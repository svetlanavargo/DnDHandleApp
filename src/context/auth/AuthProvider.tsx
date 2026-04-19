import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    getMe,
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    type UserDTO
} from '../../api/auth';
import { getApiErrorMessage } from '../../api/apiTypes';

import { AuthContext } from './AuthContext';

type AuthState = {
    user: UserDTO | null;
    loading: boolean;
};

type AuthContextValue = AuthState & {
    isAuth: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [loading, setLoading] = useState(true);

    // ---------------- RESTORE SESSION ----------------
    const refreshUser = useCallback(async () => {
        setLoading(true);

        try {
            const res = await getMe();

            if (res.ok) {
                setUser(res.data.user ?? null);
            } else {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // ---------------- LOGIN ----------------
    const login = useCallback(async (email: string, password: string) => {
        const res = await apiLogin(email, password);

        if (!res.ok) {
            throw new Error(getApiErrorMessage(res.error));
        }

        await refreshUser();
    }, [refreshUser]);

    // ---------------- REGISTER ----------------
    const register = useCallback(async (email: string, password: string) => {
        const res = await apiRegister(email, password);

        if (!res.ok) {
            throw new Error(getApiErrorMessage(res.error));
        }
    }, []);

    // ---------------- LOGOUT ----------------
    const logout = useCallback(async () => {
        await apiLogout();
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        loading,
        isAuth: !!user,
        login,
        register,
        logout,
        refreshUser
    }), [user, loading, login, register, logout, refreshUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
