export type ApiError = {
    code: string;
    message: string;
};

export type ApiResponse<T> =
    | { ok: true; data: T }
    | { ok: false; error: ApiError | string };

export function getApiErrorMessage(error: ApiError | string) {
    return typeof error === 'string' ? error : error.message;
}
