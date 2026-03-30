export type Game = {
    id: string;
    name: string;
    cards: Card[];
};

export type GamesState = {
    games: Game[];
    currentGameId: string | null;
};

export interface Card {
    id: string,
    name: string,
    maxHits: number,
    currentHits: number,
    ac: number,
    note?: string,
    isPlayer: boolean,
    initiativeBonus: number,
    color?: 'red' | 'blue' | 'green' | undefined
}