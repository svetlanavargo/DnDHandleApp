import type { UserDTO } from '../../api/auth';

export type AuthContextType = {
    user: UserDTO | null;
    loading: boolean;
    isAuth: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};