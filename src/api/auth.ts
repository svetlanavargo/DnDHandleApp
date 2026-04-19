import { apiGet, apiPost } from './client';
import type { ApiResponse } from './apiTypes';

export type UserDTO = {
    id: string;
    email: string;
};

export function login(email: string, password: string) {
    return apiPost<ApiResponse<{ user: UserDTO }>>('/api/login', {
        email,
        password,
    });
}

export function register(email: string, password: string) {
    return apiPost<ApiResponse<null>>('/api/register', {
        email,
        password,
    });
}

export function logout() {
    return apiPost<ApiResponse<null>>('/api/logout');
}

export function getMe() {
    return apiGet<ApiResponse<{ user: UserDTO | null }>>('/api/me');
}
