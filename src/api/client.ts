const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            ...options,
        });

        return await res.json();
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Network request failed'
        );
    }
}

export function apiGet<T>(path: string) {
    return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown) {
    return request<T>(path, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
    });
}
