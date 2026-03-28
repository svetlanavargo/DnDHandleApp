import { useMemo, useState, useEffect } from 'react';
import styles from './Modals.module.css';
import type { Character } from '../../types/Character.ts';
import Btn from '../UI/Btn/Btn.tsx';
import CardSlider from '../SpellsList/CardSlider/CardSlider.tsx';

import bard from '../../../public/img/CardsFill/Bard.svg';
import cleric from '../../../public/img/CardsFill/Cleric.svg';
import druid from '../../../public/img/CardsFill/Druid.svg';
import paladin from '../../../public/img/CardsFill/Paladin.svg';
import ranger from '../../../public/img/CardsFill/Ranger.svg';
import sorcerer from '../../../public/img/CardsFill/Sorcerer.svg';
import warlock from '../../../public/img/CardsFill/Warlock.svg';
import wizard from '../../../public/img/CardsFill/Wizard.svg';

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

    // синхронизация если character поменялся
    useEffect(() => {
        if (character?.fill) {
            setActiveDesign(character.fill);
        }
    }, [character?.fill]);

    // список [key, img]
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