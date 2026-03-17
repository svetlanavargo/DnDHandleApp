import { classes } from '../data/Classes/classes.json'
import { getModifier } from './getModifier'
import { getProficiencyBonus } from './getProficiencyBonus.ts'

interface SpellcastingInfo {
    ability: keyof typeof classes[keyof typeof classes]['caster']['ability']
    modifier: number
    spellAttack: number
    spellSave: number
}

/**
 * Возвращает информацию о заклинаниях персонажа.
 * Поддерживает кастеров и специальные подклассы (Arcane Trickster, Eldritch Knight).
 */
export function getSpellcastingInfo(
    className: string,
    level: number,
    characteristics: Record<string, number>,
    subclass?: string
): SpellcastingInfo | null {
    const classData = classes[className]
    if (!classData) return null

    let casterData = classData.caster

    const subclassCasters: Record<string, keyof typeof characteristics> = {
        arcane_trickster: 'INT',
        eldritch_knight: 'INT'
    }

    if (!casterData && subclass && subclassCasters[subclass]) {
        casterData = { ability: subclassCasters[subclass] }
    }

    if (!casterData) return null

    const ability = casterData.ability
    const abilityScore = characteristics[ability]
    const modifier = getModifier(abilityScore)
    const proficiency = getProficiencyBonus(level)

    return {
        ability,
        modifier,
        spellAttack: modifier + proficiency,
        spellSave: 8 + modifier + proficiency
    }
}