import {Link} from 'react-router-dom';
import styles from './MainPage.module.css';

const tetxs = [
    {
        title: `Лист персонажа – онлайн и мобильный`,
        description: `Наш <strong>лист персонажа</strong> продуман для максимального удобства: все <em>модификаторы</em>, навыки
                                и характеристики считаются автоматически.<br/><br/> Введите свои <strong>характеристики</strong>, <strong>классовые способности</strong> и
                                остальное сделает приложение.<br/><br/> <em>Треккер заклинаний</em> позволяет редактировать ячейки
                                заклинаний прямо во время игры, повышая эффективность каждого хода`,
        link: '/character_list'
    },
    {
        title: `Инвентарь и учет игрового снаряжения`,
        description: `Наш <strong>инвентарь DnD</strong> напоминает удобную заметку: никакой лишней информации,
                                только <em>предметы</em>, <em>оружие</em>, <em>магические артефакты</em> и <em>игровая валюта</em>.<br/><br/>
                                Легко отслеживать <strong>доспехи</strong>, <strong>зелья</strong> и <strong>расходники</strong>, а
                                встроенный калькулятор удобно изменяет количество валюты у вашего персонажа.<br/><br/> Теперь вам не
                                нужен отдельный блокнот и калькулятор — всё под рукой прямо в телефоне`,
        link: '/inventory'
    },
    {
        title: `Список заклинаний — магический арсенал`,
        description: `Храните и сортируйте свои <strong>заклинания DnD</strong>, выбирайте рубашку карточек для
                                полного погружения в атмосферу <em>настольной игры</em>.<br/><br/>
                                Приложение помогает отслеживать <em>уровень заклинаний</em>, количество подготовленных
                                заклинаний и те, которые персонаж знает по умолчанию.<br/><br/> Экономьте место на столе и
                                ускоряйте подготовку сессии, используя наш <strong>магический треккер</strong> и функцию
                                быстрого поиска по выбранному классу вашего персонажа`,
        link: '/spells_list'
    },
    {
        title: `Дайсы`,
        description: `Бросайте любые <strong>дайсы DnD</strong> прямо в приложении:
                                d4, d6, d8, d10, d12, d20, d100.
                                Если за столом не хватает кубиков — наш <strong>виртуальный набор дайсов</strong> решает проблему.<br/><br/>
                                Идеально для <em>боевых сессий</em>, <em>кампаний</em> и <em>онлайн-игр</em>, экономит время и ускоряет ход игры`,
        link: '/dice'
    }
]

function MainPage() {
    return(
        <div className={styles.mainPageContainer}>
            <div className={styles.offer}>
                <div className={styles.offerText}>
                    <h1 className={styles.offerHeader}>DnD App —  менеджер персонажей и трекер боя</h1>

                    <p className={styles.offerDesc}>
                        DnD Tracker — это удобное приложение для мастеров и игроков.
                        Следите за инициативой, хитами, эффектами и состоянием боя в реальном времени.
                    </p>
                </div>
            </div>
            <div className={styles.mainPage}>
                <h2 className={styles.subtitle}>Что входит в <strong>Dnd App</strong>:</h2>
                <div className={styles.descriptionsWrap}>
                    <div className={styles.cardContainer}>
                        <h3 className={styles.cardHeader}>
                            <Link className={styles.cardLink} to="/battle_tracker">ДМ треккер для мастеров подземелий</Link>
                        </h3>
                        <p className={styles.cardDescription}>Для каждого <strong>Dungeon Master</strong> наш <strong>ДМ треккер</strong> станет
                            незаменимым помощником в <em>подземельях</em> и <em>боевых сценах</em>.<br className={styles.br}/><br className={styles.br}/> Приложение
                            автоматически считает <em>раунды</em>, <em>инициативу</em> и <em>время хода</em>,
                            освобождая вас от ручного подсчета. <br className={styles.br}/><br className={styles.br}/> Легко заполняйте <strong>список карт</strong>,
                            выбирайте их для боя, а при гибели карточка остаётся для внезапного использования.  <br className={styles.br}/><br className={styles.br}/><em>Поле для заметок</em> поможет
                            отслеживать заклинания, состояния персонажей и эффекты предметов, чтобы ничего не потерять во время сессии</p>
                    </div>
                    <div className={styles.cardsFlex}>
                        {tetxs.map((item, index) => (
                            <div key={index} className={styles.cardContainer}>
                                <h3 className={styles.cardHeader}>
                                    <Link className={styles.cardLink} to={item.link}>
                                        {item.title}
                                    </Link>
                                </h3>

                                <p
                                    className={styles.cardDescription}
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage;