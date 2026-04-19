import styles from './SectionHeader.module.css';

interface SectionsHeaderProps {
    title: string;
    subtitle: string
}

export default function SectionHeader({title, subtitle}: SectionsHeaderProps) {
    return(
        <div className={styles.header}>
            <p className={styles.subtitle}>{subtitle}</p>
            <p className={styles.title}>{title}</p>
        </div>
    )
}