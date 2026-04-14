import styles from './ClassIcon.module.css';
import type { ClassKey } from "../../../types/dnd.ts";

interface ClassIconProps {
    spec: ClassKey;
    size: 'big' | 'medium' | 'small';
}

function ClassIcon({ spec, size }: ClassIconProps) {
    const className = `${styles[spec as keyof typeof styles]} ${styles[size]}`;

    return <div className={className} />;
}

export default ClassIcon;