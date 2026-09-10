import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import { ThemeProvider } from './theme/ThemeContext'
import { FontSizeProvider } from './theme/FontSizeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <FontSizeProvider>
          <App />
        </FontSizeProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
