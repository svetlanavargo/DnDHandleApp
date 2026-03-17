export function getSpellsKnown(className: string, level: number) {
    const caster = classes[className]?.caster

    if (!caster?.spellsKnown) return null

    return caster.spellsKnown[level] ?? 0
}