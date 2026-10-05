import { brand, tel, waLink } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import OpenStatus from './OpenStatus.jsx'

export default function Hero() {
  const { t } = useLang()
  const h = t.hero
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="badge" data-reveal>
            <span className="badge__spark" aria-hidden="true" />
            {h.badge}
          </p>
          <h1 id="hero-title" className="hero__title" data-reveal>
            <span className="sr-only">NVS Motors — </span>
            <span className="hero__line">{h.title1}</span>{' '}
            <span className="hero__line text-gold">{h.title2}</span>
          </h1>
          <p className="hero__lead" data-reveal>{h.lead}</p>

          <ul className="hero__quick" data-reveal>
            {h.quick.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <div className="hero__actions" data-reveal>
            <a className="btn btn--wa btn--lg" href={waLink(t.booking.hello)} target="_blank" rel="noopener">
              <Icon name="whatsapp" size={22} />
              {h.cta}
            </a>
            <a className="btn btn--glass btn--lg" href={tel}>
              <Icon name="phone" size={20} />
              {h.call}
            </a>
          </div>

          <div className="hero__meta" data-reveal>
            <a className="rating" href={brand.maps} target="_blank" rel="noopener">
              <Icon name="google" size={18} />
              <strong>{brand.rating.value.toFixed(1).replace('.', ',')}</strong>
              <span className="rating__stars" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" size={15} />
                ))}
              </span>
              <span>
                {h.rating} · {brand.rating.count} {h.reviews}
              </span>
            </a>
            <OpenStatus />
          </div>
        </div>

        <div className="hero__emblem" data-reveal aria-hidden="true">
          <div className="hero__ring" />
          <img src="/logo.webp" alt="" width="900" height="596" />
        </div>
      </div>
      <a className="hero__scroll" href="#services" aria-label={h.scroll}>
        <Icon name="chevron" />
      </a>
    </section>
  )
}
