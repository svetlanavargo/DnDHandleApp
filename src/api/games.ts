import { apiGet, apiPost } from './client';
import type { ApiResponse } from './apiTypes';
import type { Game } from '../types/Game';

export type ApiGame = Omit<Game, 'turnTimeMode'> & {
    turnTimeMode: 'round' | 'time';
};

export function getGames() {
    return apiGet<ApiResponse<ApiGame[]>>('/api/games');
}

export function createGame(game: ApiGame) {
    return apiPost<ApiResponse<ApiGame>>('/api/games', game);
}

export function updateGame(game: ApiGame) {
    return apiPost<ApiResponse<ApiGame>>('/api/games/update', game);
}

export function deleteGame(id: string) {
    return apiPost<ApiResponse<null>>('/api/games/delete', { id });
}
