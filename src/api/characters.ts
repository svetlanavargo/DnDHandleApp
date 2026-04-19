import { apiGet, apiPost } from './client';
import type { ApiResponse } from './apiTypes';
import type { Character } from '../types/Character';

export function getCharacters() {
    return apiGet<ApiResponse<Character[]>>('/api/characters');
}

export function createCharacter(character: Character) {
    return apiPost<ApiResponse<Character>>('/api/characters', character);
}

export function updateCharacter(character: Character) {
    return apiPost<ApiResponse<Character>>('/api/characters/update', character);
}

export function deleteCharacter(id: string) {
    return apiPost<ApiResponse<null>>('/api/characters/delete', { id });
}
