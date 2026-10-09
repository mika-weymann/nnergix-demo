import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './components/ui/Toast';
import { BrandProvider } from './context/BrandContext';
import { DemoProvider } from './context/DemoContext';
import './styles/globals.css';

const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
if (plausibleDomain) {
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://plausible.io/js/script.js';
  s.setAttribute('data-domain', plausibleDomain);
  document.head.appendChild(s);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <BrandProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrandProvider>
      </DemoProvider>
    </BrowserRouter>
  </StrictMode>,
);
