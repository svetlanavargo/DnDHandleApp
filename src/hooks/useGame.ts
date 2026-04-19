import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export const useGame = () => {
    const ctx = useContext(GameContext);

    if (!ctx) {
        throw new Error('useGame must be used inside AppProvider');
    }

    return ctx;
};
