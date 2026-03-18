import type {
    Classes,
    Class,
    Caster,
    Ability,
    ProgressionType,
    CasterType,
    RawClasses
} from '../types/dnd';

const abilities: Ability[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const casterTypes: CasterType[] = ['prepared', 'known', 'spellbook', 'pact'];
const progressions: ProgressionType[] = ['full', 'half', 'third', 'pact'];

function isAbility(value: string): value is Ability {
    return abilities.includes(value as Ability);
}

function isCasterType(value: string): value is CasterType {
    return casterTypes.includes(value as CasterType);
}

function isProgression(value: string): value is ProgressionType {
    return progressions.includes(value as ProgressionType);
}

function normalizeCaster(raw: any): Caster {
    if (!isCasterType(raw.type)) {
        throw new Error(`Invalid caster type: ${raw.type}`);
    }

    if (!isAbility(raw.ability)) {
        throw new Error(`Invalid ability: ${raw.ability}`);
    }

    if (!isProgression(raw.progression)) {
        throw new Error(`Invalid progression: ${raw.progression}`);
    }

    return {
        ...raw,
        type: raw.type,
        ability: raw.ability,
        progression: raw.progression
    };
}

export function normalizeClasses(raw: RawClasses): Classes {
    const result: Classes = {};

    for (const key in raw) {
        const cls = raw[key];

        const normalized: Class = {
            hitDice: cls.hitDice,
            url: cls.url,
            savingThrows: cls.savingThrows.filter(isAbility),

            caster: cls.caster ? normalizeCaster(cls.caster) : null,

            subclasses: cls.subclasses
                ? Object.fromEntries(
                    Object.entries(cls.subclasses).map(([subKey, sub]) => [
                        subKey,
                        {
                            caster: sub.caster
                                ? normalizeCaster(sub.caster)
                                : undefined
                        }
                    ])
                )
                : undefined
        };

        result[key] = normalized;
    }

    return result;
}