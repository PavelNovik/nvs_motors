import { brand, navIds, tel } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import { openCookieSettings } from './CookieConsent.jsx'
import Icon from './Icon.jsx'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
  const year = 2026
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src="/logo.svg" alt="NVS Motors" width="430" height="236" loading="lazy" />
          <p className="footer__tagline text-gold">{f.tagline}</p>
        </div>
        <nav aria-label={t.nav.menu}>
          <ul className="footer__nav">
            {navIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{t.nav.items[id]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__contact">
          <p>
            {brand.street}, {brand.postalCode} {brand.city}
          </p>
          <p>
            <a href={tel}>{brand.phone}</a>
          </p>
          <div className="social-icons">
            <a href={brand.social.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href={brand.social.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
              <Icon name="tiktok" />
            </a>
            <a href={brand.maps} target="_blank" rel="noopener" aria-label="Google Maps">
              <Icon name="google" />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>
          © {year} {brand.fullName}. {f.rights}
        </p>
        <p className="footer__meta">
          <button type="button" className="link-btn" onClick={openCookieSettings}>
            {f.cookies}
          </button>
          <span>{f.photos}</span>
          <a href="#main">{f.top} ↑</a>
        </p>
      </div>
    </footer>
  )
}
