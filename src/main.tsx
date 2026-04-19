import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/auth/AuthProvider';
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <HelmetProvider>
          <AuthProvider>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </AuthProvider>
      </HelmetProvider>
  </StrictMode>,
)
