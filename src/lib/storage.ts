import type { Game } from '../types/Game.ts';
import type { Character } from '../types/Character.ts';

const STORAGE_KEY = 'app_storage';

export function generateUserId() {
    return crypto.randomUUID();
}

export type AppStore = {
    users: Record<string, {
        currentGameId: string | null;
        activeCharacterId: string | null;
        accessKey?: string;
    }>;

    games: Record<string, Game[]>;
    characters: Record<string, Character[]>;
};

const defaultStore: AppStore = {
    users: {},
    games: {},
    characters: {},
};

export function getStore(): AppStore {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return JSON.parse(JSON.stringify(defaultStore));

    try {
        return JSON.parse(raw);
    } catch {
        return defaultStore;
    }
}

export function setStore(store: AppStore) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function ensureUser(store: AppStore, userId: string) {
    if (!store.users[userId]) {
        store.users[userId] = {
            currentGameId: null,
            activeCharacterId: null,
        };
    }

    if (!store.games[userId]) {
        store.games[userId] = [];
    }

    if (!store.characters[userId]) {
        store.characters[userId] = [];
    }
}

export function createUser(userId: string) {
    const store = getStore();

    ensureUser(store, userId);

    setStore(store);
}