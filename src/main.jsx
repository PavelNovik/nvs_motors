import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { langFromPath } from './i18n/index.jsx'
// Шрифты с нашего домена (без Google Fonts CDN — RODO); latin-ext — польские буквы, cyrillic — украинская версия.
// Russo One — заголовки «как на вывеске», Oswald — узкие подписи/цифры, Manrope — текст
import '@fontsource/russo-one/latin-400.css'
import '@fontsource/russo-one/latin-ext-400.css'
import '@fontsource/russo-one/cyrillic-400.css'
import '@fontsource/oswald/latin-500.css'
import '@fontsource/oswald/latin-ext-500.css'
import '@fontsource/oswald/cyrillic-500.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-ext-400.css'
import '@fontsource/manrope/cyrillic-400.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/manrope/latin-ext-700.css'
import '@fontsource/manrope/cyrillic-700.css'
import './styles/variables.css'
import './styles/global.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App initialLang={langFromPath(location.pathname)} />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
