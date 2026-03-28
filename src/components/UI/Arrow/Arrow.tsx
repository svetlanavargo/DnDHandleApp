import styles from './Arrow.module.css';

interface ArrowProps {
    open: boolean
}

function Arrow({open}: ArrowProps) {
    return (
        <span className={`${styles.arrow} ${open ? styles.open : ""}`} />
    )
}

export default Arrow;