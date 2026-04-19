import SectionHeader from '../SectionHeader/SectionHeader.tsx';
import Logo from '../../../../public/img/dnd.svg';
import styles from './CardsTable.module.css';

const CARDS_TABLE_TEXT = {
    subtitle: 'Всегда под рукой',
    title: 'Все что нужно для твоей DnD сессии',
    logoAlt: 'DnD tools',
    trackerDescription: [
        'DnD Tracker — это удобное приложение для мастеров.',
        'Следите за инициативой, хитами, эффектами',
        'и состоянием боя в реальном времени.'
    ],
    featureTitle: 'Просто и эффективно',
    featureDescription:
        'Все инструменты для DnD в одном месте — персонажи, инвентарь, заклинания и кубики.',
    syncTitle: 'Сохранение данных для перехода между устройствами',
    moreTitle: 'И многое другое...'
} as const;

const TOOL_CARDS = [
    {
        title: 'Дайсы',
        description:
            'Все кубы DnD: d4–d100. Быстрые броски для боёв, кампаний и онлайн-сессий.',
        link: '/dice'
    },
    {
        title: 'Лист персонажа',
        description:
            'Автоматический расчет характеристик, навыков и модификаторов. Удобный трекер заклинаний прямо в игре.',
        link: '/character_list'
    },
    {
        title: 'Инвентарь',
        description:
            'Предметы, оружие, артефакты и валюта в одном месте. Быстрое управление экипировкой и расходниками.',
        link: '/inventory'
    },
    {
        title: 'Заклинания',
        description:
            'Хранение, сортировка и отслеживание заклинаний. Уровни, подготовка и быстрый поиск по классу.',
        link: '/spells_list'
    },
 ] as const;

export default function CardsTable() {
    return (
        <section className={styles.tools}>
            <div className={styles.container}>
                <SectionHeader
                    title={CARDS_TABLE_TEXT.title}
                    subtitle={CARDS_TABLE_TEXT.subtitle}
                />

                <div className={styles.grid}>

                    {/* CARD 1 (оставляем как feature block) */}
                    <div className={`${styles.card} ${styles.card1}`}>
                        <div className={styles.card1Inner}>
                            <img
                                src={Logo}
                                className={styles.card1img}
                                alt={CARDS_TABLE_TEXT.logoAlt}
                            />
                            <p className={styles.description}>
                                {CARDS_TABLE_TEXT.trackerDescription[0]} <br/>
                                {CARDS_TABLE_TEXT.trackerDescription[1]} <br/>
                                {CARDS_TABLE_TEXT.trackerDescription[2]}
                            </p>
                        </div>
                    </div>

                    {/* CARD 2 */}
                    <div className={`${styles.card} ${styles.card2}`}>
                        <p className={styles.cardTitle}>{TOOL_CARDS[0].title}</p>
                        <p className={styles.description}>{TOOL_CARDS[0].description}</p>
                    </div>

                    {/* CARD 3 */}
                    <div className={`${styles.card} ${styles.card3}`}>
                        <p className={styles.cardTitle}>{TOOL_CARDS[1].title}</p>
                        <p className={styles.description}>{TOOL_CARDS[1].description}</p>
                    </div>

                    {/* CARD 4 */}
                    <div className={`${styles.card} ${styles.card4}`}>
                        <p className={styles.cardTitle}>{TOOL_CARDS[2].title}</p>
                        <p className={styles.description}>{TOOL_CARDS[2].description}</p>
                    </div>

                    {/* CARD 5 */}
                    <div className={`${styles.card} ${styles.card5}`}>
                        <p className={styles.cardTitle}>{TOOL_CARDS[3].title}</p>
                        <p className={styles.description}>{TOOL_CARDS[3].description}</p>
                    </div>

                    {/* CARD 6 (оставляем как “feature highlight”) */}
                    <div className={`${styles.card} ${styles.card6}`}>
                        <p className={styles.cardTitle}>{CARDS_TABLE_TEXT.featureTitle}</p>
                        <p className={styles.description}>{CARDS_TABLE_TEXT.featureDescription}</p>
                    </div>

                    {/* CARD 7 */}
                    <div className={`${styles.card} ${styles.card7}`}>
                        <p className={styles.cardTitle}>{CARDS_TABLE_TEXT.syncTitle}</p>
                    </div>

                    {/* CARD 8 */}
                    <div className={`${styles.card} ${styles.card8}`}>
                        <p className={styles.cardTitle}>{CARDS_TABLE_TEXT.moreTitle}</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
