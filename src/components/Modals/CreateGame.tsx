import { useState, useRef, useEffect } from 'react';
import Btn from '../UI/Btn/Btn.tsx';
import Input from '../UI/Input/Input.tsx';
import styles from './Modals.module.css';

interface CreateGameProps {
    onCreate: (name: string) => void;
    onClose: () => void;
}

function CreateGame({ onCreate, onClose }: CreateGameProps) {
    const [name, setName] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        const trimmed = name.trim();

        if (!trimmed) return;

        onCreate(trimmed);
        onClose();
    };

    return (
        <div className={styles.createGame}>
            <h2>Введите название игры</h2>

            <Input
                ref={inputRef}
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Кампания в подземелье"
            />

            <div className={styles.modalButtons}>
                <Btn
                    onClick={handleSubmit}
                    classBtn='btnColor'
                >
                    Создать
                </Btn>

                <Btn onClick={onClose}>
                    Закрыть
                </Btn>
            </div>
        </div>
    );
}

export default CreateGame;