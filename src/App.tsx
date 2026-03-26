import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO_LANDING } from './constants/SEO_LANDING.ts';
import NotFound from './components/NotFound/NotFound.tsx';
import CharacterProvider from './context/CharacterProvider.tsx';
import Header from './components/Header/Header.tsx';
import DiceModal from './components/DiceModal/DiceModal.tsx';
import MainPage from './components/MainPage/MainPage.tsx';
import Dice from './components/DiceModal/Dice/Dice.tsx';
import CharacterList from './components/CharacterList/CharacterList.tsx';
import BattleTracker from './components/BattleTracker/BattleTracker.tsx';
import SpellsList from './components/SpellsList/SpellsList.tsx';
import Inventory from './components/Inventory/Inventory.tsx';
import YandexMetrika from "./utils/YandexMetrika.tsx";
import './App.css';

function App() {
    const [isDiceOpen, setIsDiceOpen] = useState(false);
    return (
        <>
            <Helmet>
                <title>{SEO_LANDING.title}</title>

                <meta name="description" content={SEO_LANDING.description} />
                <meta name="keywords" content={SEO_LANDING.keywords} />

                {/* Open Graph */}
                <meta property="og:title" content={SEO_LANDING.title} />
                <meta property="og:description" content={SEO_LANDING.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SEO_LANDING.url} />
                <meta property="og:image" content={SEO_LANDING.image} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={SEO_LANDING.title} />
                <meta name="twitter:description" content={SEO_LANDING.description} />
                <meta name="twitter:image" content={SEO_LANDING.image} />
            </Helmet>
            <BrowserRouter>
                <Header setIsDiceOpen={() => setIsDiceOpen(true)} />
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <DiceModal
                    isOpen={isDiceOpen}
                    onClose={() => setIsDiceOpen(false)}
                />
                <YandexMetrika id={108149485}/>
            </BrowserRouter>
        </>
    );
}

export default App;