import styles from './Offer.module.css';

export default function Offer() {
    return(
        <div className={styles.offer}>
            <div className={styles.offerText}>
                <h1 className={styles.offerHeader}>DnD App —  менеджер персонажей и трекер боя</h1>
            </div>
        </div>
    )
}