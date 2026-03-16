import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.tsx';
import Dice from './components/Dice/Dice.tsx';
import CharacterList from './components/CharacterList/CharacterList.tsx';
import BattleTracker from './components/BattleTracker/BattleTracker.tsx';
import SpellsList from './components/Spells List/SpellsList.tsx';
import Inventory from './components/Inventory/Inventory.tsx';
import './App.css'

export interface Card {
    id: string,
    name: string,
    maxHits: number,
    currentHits: number,
    ac: number,
    note?: string,
    isPlayer: boolean,
    initiativeBonus: number,
    color?: 'red' | 'blue' | 'green' | undefined
}

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/dice" element={<Dice />} />
                <Route path="/character_list" element={<CharacterList />} />
                <Route path="/spells_list" element={<SpellsList />} />
                <Route path="/battle_tracker" element={<BattleTracker />} />
                <Route path="/inventory" element={<Inventory />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;