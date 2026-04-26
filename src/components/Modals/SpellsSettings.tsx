import { useMemo, useState } from 'react';
import styles from './Modals.module.css';
import type { Character } from '../../types/Character.ts';
import Btn from '../UI/Btn/Btn.tsx';
import CardSlider from '../SpellsList/CardSlider/CardSlider.tsx';

import bard from '../../assets/img/CardsFill/Bard.svg';
import cleric from '../../assets/img/CardsFill/Cleric.svg';
import druid from '../../assets/img/CardsFill/Druid.svg';
import paladin from '../../assets/img/CardsFill/Paladin.svg';
import ranger from '../../assets/img/CardsFill/Ranger.svg';
import sorcerer from '../../assets/img/CardsFill/Sorcerer.svg';
import warlock from '../../assets/img/CardsFill/Warlock.svg';
import wizard from '../../assets/img/CardsFill/Wizard.svg';

interface SpellsSettingsProps {
    character?: Character;
    handleModalToggle: () => void;
    updateCharacter: (updated: Character) => void;
}

const design: Record<string, string> = {
    bard,
    cleric,
    druid,
    paladin,
    ranger,
    sorcerer,
    warlock,
    wizard,
};

function SpellsSettings({
                            character,
                            handleModalToggle,
                            updateCharacter
                        }: SpellsSettingsProps) {

    const [activeDesign, setActiveDesign] = useState<string>(
        character?.fill || "sorcerer"
    );

    const designList = useMemo(() => {
        return Object.entries(design);
    }, []);

    function handleSaveDesign() {
        if (!character) return;

        updateCharacter({
            ...character,
            fill: activeDesign
        });
    }

    return (
        <div className={styles.modalWrapperFlex}>
            <div className={styles.flex}>
                <h3>Выбери дизайн карты</h3>
                <Btn onClick={handleModalToggle} classBtn="close" />
            </div>

            <div className={styles.spellsList}>
                <CardSlider
                    items={designList}
                    getKey={(item) => item[0]}
                    onActiveChange={(item) => setActiveDesign(item[0])}
                    renderItem={(item) => {
                        const [key, img] = item;

                        return (
                            <div
                                className={`${styles.designCard} ${
                                    activeDesign === key ? styles.active : ""
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={key}
                                    className={styles.designImg}
                                />
                            </div>
                        );
                    }}
                />
            </div>

            <div className={styles.modalButtons}>
                <Btn onClick={handleSaveDesign} classBtn="btnColor">
                    Сохранить
                </Btn>

                <Btn onClick={handleModalToggle}>
                    Закрыть
                </Btn>
            </div>
        </div>
    );
}

export default SpellsSettings;
