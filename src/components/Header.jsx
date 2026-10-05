import { useEffect, useState } from 'react'
import { navIds, waLink } from '../config.js'
import { langPath, useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import LangSwitcher from './LangSwitcher.jsx'
import OpenStatus from './OpenStatus.jsx'

export default function Header() {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`header${open ? ' is-open' : ''}`}>
      <div className="header__inner">
        <a className="header__logo" href={langPath(lang)} aria-label="NVS Motors">
          <img src="/logo-sm.webp" srcSet="/logo-sm.webp 360w, /logo.webp 900w" sizes="120px" alt="NVS Motors" width="360" height="238" />
        </a>

        <nav className="nav" id="site-nav" aria-label={t.nav.menu}>
          <ul>
            {navIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setOpen(false)}>
                  {t.nav.items[id]}
                </a>
              </li>
            ))}
          </ul>
          <OpenStatus className="nav__status" />
        </nav>

        <div className="header__actions">
          <LangSwitcher />
          <a className="btn btn--wa btn--small header__wa" href={waLink(t.booking.hello)} target="_blank" rel="noopener">
            <Icon name="whatsapp" size={18} />
            <span>{t.nav.book}</span>
          </a>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}
