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