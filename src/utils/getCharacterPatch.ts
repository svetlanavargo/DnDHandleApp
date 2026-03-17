export function getCharacterPatch<T extends object>(
    original: T,
    updated: T
): Partial<T> {
    const patch: Partial<T> = {};

    for (const key of Object.keys(updated) as (keyof T)[]) {
        const oldValue = original[key];
        const newValue = updated[key];

        const changed =
            typeof newValue === "object"
                ? JSON.stringify(oldValue) !== JSON.stringify(newValue)
                : oldValue !== newValue;

        if (changed) {
            patch[key] = newValue;
        }
    }

    return patch;
}