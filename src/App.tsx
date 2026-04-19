import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO_LANDING } from './constants/SEO_LANDING.ts';
import { AppProvider } from './context/AppProvider.tsx';
import { useAuth } from './context/auth/useAuth.ts';

import NotFound from './components/NotFound/NotFound.tsx';

import AuthPage from './components/AuthPage/AuthPage.tsx';

import Header from './components/Header/Header.tsx';
import MainPage from './components/MainPage/MainPage.tsx';
import CharacterList from './components/CharacterList/CharacterList.tsx';
import BattleTracker from './components/BattleTracker/BattleTracker.tsx';
import SpellsList from './components/SpellsList/SpellsList.tsx';
import Inventory from './components/Inventory/Inventory.tsx';

import PortalModal from './components/Modals/PortalModal/PortalModal.tsx';
import Dice from './components/Dice/Dice.tsx';
import SessionLoading from './components/SessionLoading/SessionLoading.tsx';

import YandexMetrika from './utils/YandexMetrika.tsx';

import './App.css';

function App() {
    const [isDiceOpen, setIsDiceOpen] = useState(false);
    const { loading } = useAuth();

    if (loading) {
        return (
            <>
                <Helmet>
                    <title>{SEO_LANDING.title}</title>
                </Helmet>
                <SessionLoading />
            </>
        );
    }

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
            <AppProvider>
                <Header
                    setIsDiceOpen={() => setIsDiceOpen(true)}
                />

                <Routes>
                    <Route
                        path="/"
                        element={<MainPage />}
                    />
                    <Route
                        path="/battle_tracker"
                        element={<BattleTracker />}
                    />

                    <Route
                        path="/character_list/*"
                        element={<CharacterList />}
                    />

                    <Route
                        path="/spells_list/*"
                        element={<SpellsList />}
                    />

                    <Route
                        path="/inventory/*"
                        element={<Inventory />}
                    />

                    <Route
                        path="/register"
                        element={<AuthPage pageType="register" />}
                    />

                    <Route
                        path="/login"
                        element={<AuthPage pageType="login" />}
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>

                <PortalModal
                    isOpen={isDiceOpen}
                    onClose={() => setIsDiceOpen(false)}
                >
                    <Dice/>
                </PortalModal>
                <YandexMetrika id={108149485}/>
            </AppProvider>
        </>
    );
}

export default App;
