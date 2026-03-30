import Btn from '../UI/Btn/Btn.tsx';
import Select from '../UI/Select/Select.tsx';
import styles from './Modals.module.css';
import type {Game} from "../../context/GameProvider.tsx";

interface GameSettingsProps {
    game: Game;
    onClose: () => void;
    onOpenDeleteGame: () => void;
    onChangeMode: (gameId: string, mode: 'turn' | 'round') => void;
}

function GameSettings({
                          game,
                          onClose,
                          onOpenDeleteGame,
                          onChangeMode
                      }: GameSettingsProps) {

    return (
        <div className={styles.createGame}>
            <h2>Настройки</h2>
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