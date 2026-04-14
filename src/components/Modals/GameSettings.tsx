import { useState, } from 'react';
import type { Game } from '../../types/Game.ts';
import Btn from '../UI/Btn/Btn.tsx';
import Input from '../UI/Input/Input.tsx';
import Select from '../UI/Select/Select.tsx';
import styles from './Modals.module.css';

interface GameSettingsProps {
    game: Game;
    onClose: () => void;
    onOpenDeleteGame: () => void;
    onChangeMode: (gameId: string, mode: 'turn' | 'round') => void;
    onRename: (gameId: string, name: string) => void;
}

function GameSettings({
                          game,
                          onClose,
                          onOpenDeleteGame,
                          onChangeMode,
                          onRename
                      }: GameSettingsProps) {
    const [name, setName] = useState(game.name);

    return (
        <div className={styles.createGame}>
            <h2>Настройки</h2>
            <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                    if (name.trim() && name !== game.name) {
                        onRename(game.id, name.trim());
                    }
                }}
                placeholder="Например: Кампания в подземелье"
            > Изменить название </Input>
            <Select
                label="Режим Мамикона"
                value={game.turnTimeMode}
                options={{
                    turn: '6 сек - ход',
                    round: '6 сек - раунд'
                }}
                onChange={(value) => {
                    if (!value) return;
                    onChangeMode(game.id, value as 'turn' | 'round');
                }}
            />
            <div className={styles.modalButtons}>
                <p className={styles.deleteGame}>Удалить игру?</p>
                <Btn
                    onClick={onOpenDeleteGame}
                    children='Удалить'
                    classBtn='btnRed'
                />
            </div>
            <div className={styles.modalButtons}>
                <Btn onClick={onClose}>
                    Закрыть
                </Btn>
            </div>
        </div>
    );
}

export default GameSettings;