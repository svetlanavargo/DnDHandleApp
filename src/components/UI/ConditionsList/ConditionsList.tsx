import type { Condition } from "../../../types/dnd.ts";
import { remainingTimeInMinutes } from "../../../utils/getTime";

interface Props {
    conditions?: Condition[];
}

const CONDITION_COLORS: Record<string, string> = {
    blinded: "#c084fc",
    charmed: "#60a5fa",
    deafened: "#94a3b8",
    frightened: "#f87171",
    grappled: "#fbbf24",
    incapacitated: "#ef4444",
    invisible: "#38bdf8",
    petrified: "#a3a3a3",
    poisoned: "#22c55e",
    prone: "#f59e0b",
    restrained: "#eab308",
    stunned: "#fb7185",
    unconscious: "#64748b",
    concentration: "#3b82f6"
};

function getConditionColor(name: string): string {
    return CONDITION_COLORS[name] ?? "#e5e7eb";
}

export default function ConditionsList({ conditions }: Props) {
    if (!conditions?.length) return null;
    console.log(conditions)
    function pluralizeRound(value: number): string {
        const abs = Math.abs(value);

        if (abs % 10 === 1 && abs % 100 !== 11) {
            return `${value} раунд`;
        }

        if (
            abs % 10 >= 2 &&
            abs % 10 <= 4 &&
            !(abs % 100 >= 12 && abs % 100 <= 14)
        ) {
            return `${value} раунда`;
        }

        return `${value} раундов`;
    }

    return (
        <ul>
            {conditions.map(cond => (
                <li
                    key={cond.id}
                    style={{
                        color: getConditionColor(cond.name),
                        fontWeight: 600
                    }}
                >
                    {cond.label} -{" "}
                    {cond.type === "time"
                        ? `${remainingTimeInMinutes(cond.remaining)} мин`
                        : pluralizeRound(cond.remaining)}
                </li>
            ))}
        </ul>
    );
}