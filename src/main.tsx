import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './Root';
import './index.css';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <UserProvider>
            <Root />
          </UserProvider>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
