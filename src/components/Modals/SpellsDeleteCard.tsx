import { useMemo, useState } from "react";
import styles from './Modals.module.css';

import type { Character } from "../../types/Character.ts";
import type { Spell, SpellLevel } from "../../types/dnd";

import Btn from "../UI/Btn/Btn.tsx";
import CardSlider from "../SpellsList/CardSlider/CardSlider.tsx";
import SpellCard from "../SpellsList/SpellCard/SpellCard.tsx";

import spellsJson from "../../data/Spells/spells.json";

interface SpellsDeleteCardProps {
    character?: Character;
    handleModalToggle: () => void;
    updateCharacter: (updated: Character) => void;
}

function SpellsDeleteCard({
                              character,
                              updateCharacter,
                              handleModalToggle
                          }: SpellsDeleteCardProps) {

    const [activeSpell, setActiveSpell] = useState<Spell | null>(null);

    // ================= FLATTEN SPELLS =================
    const selectedSpells = useMemo(() => {
        if (!character?.spells) return [];

        const allSpells = spellsJson as Spell[];

        const result: Spell[] = [];

        for (const levelKey in character.spells) {
            const urls = character.spells[levelKey as SpellLevel] || [];

            urls.forEach((url) => {
                const spell = allSpells.find(s => s.url === url);
                if (spell) result.push(spell);
            });
        }

        return result;
    }, [character]);

    // ================= DELETE =================
    function handleDeleteSpell() {
        if (!character || !activeSpell) return;

        const levelKey = activeSpell.lvl as SpellLevel;

        const updatedLevel = (character.spells?.[levelKey] || [])
            .filter(url => url !== activeSpell.url);

        updateCharacter({
            ...character,
            spells: {
                ...character.spells,
                [levelKey]: updatedLevel
            }
        });

        setActiveSpell(null);
    }

    return (
        <div className={styles.modalWrapperFlex}>
            <div className={styles.flex}>
                <h3>Удаление заклинаний</h3>
                <Btn onClick={handleModalToggle} classBtn="close" />
            </div>

            <div className={styles.spellsList}>
                {selectedSpells.length === 0 ? (
                    <p>Нет выбранных заклинаний</p>
                ) : (
                    <>
                        <CardSlider
                            items={selectedSpells}
                            getKey={(spell) => spell.url}
                            onActiveChange={setActiveSpell}
                            renderItem={(spell) => (
                                <SpellCard
                                    spell={spell}
                                    fill={character?.fill || "sorcerer"}
                                    size="small"
                                    isAdded
                                />
                            )}
                        />

                        <Btn onClick={handleDeleteSpell} classBtn='btnRed'>
                            Удалить
                        </Btn>
                    </>
                )}
            </div>
        </div>
    );
}

export default SpellsDeleteCard;