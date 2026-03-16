export const getProficiencyBonus = (level: number): number => {
    return Math.floor((level - 1) / 4) + 2
}