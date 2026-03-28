import styles from './NoSpell.module.css';

function NoSpell() {
    return(
        <div className={styles.noSpellContainer}>
            <div className={styles.cards}/>
            <p>В списке заклинаний пусто :(</p>
        </div>
    )
}

export default NoSpell;