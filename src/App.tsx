import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CharacterProvider from './context/CharacterProvider.tsx';
import Header from './components/Header/Header.tsx';
import MainPage from './components/MainPage/MainPage.tsx';
import Dice from './components/Dice/Dice.tsx';
import CharacterList from './components/CharacterList/CharacterList.tsx';
import BattleTracker from './components/BattleTracker/BattleTracker.tsx';
import SpellsList from './components/Spells List/SpellsList.tsx';
import Inventory from './components/Inventory/Inventory.tsx';
import YandexMetrika from "./components/YandexMetrika.tsx";
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/battle_tracker" element={<BattleTracker />} />
                <Route path="/dice" element={<Dice />} />
                <Route path="/" element={<MainPage />} />

                <Route
                    path="/character_list/*"
                    element={
                        <CharacterProvider>
                            <CharacterList />
                        </CharacterProvider>
                    }
                />
                <Route
                    path="/spells_list/*"
                    element={
                        <CharacterProvider>
                            <SpellsList />
                        </CharacterProvider>
                    }
                />
                <Route
                    path="/inventory/*"
                    element={
                        <CharacterProvider>
                            <Inventory />
                        </CharacterProvider>
                    }
                />
            </Routes>
            <YandexMetrika id={108149485}/>
        </BrowserRouter>
    );
}

export default App;