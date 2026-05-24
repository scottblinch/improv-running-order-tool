import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import '@/i18n';
import { registerServiceWorker } from '@/pwa/register-service-worker';
import './index.css';
import App from './App.tsx';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
