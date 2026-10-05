import { img, waLink } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'

// Баннер-призыв: фото меняется под экран (вертикальный кадр на телефоне)
export default function CtaBand() {
  const { t } = useLang()
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band__box" data-reveal data-glow>
          <picture>
            <source media="(max-width: 700px)" srcSet={`${img('cta-mobile', 'sm')} 450w, ${img('cta-mobile')} 900w`} sizes="100vw" />
            <img
              className="cta-band__img"
              src={img('cta', 'sm')}
              srcSet={`${img('cta', 'sm')} 900w, ${img('cta')} 1800w`}
              sizes="(max-width: 1240px) 100vw, 1200px"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div className="cta-band__content">
            <h2 id="cta-title" className="cta-band__title">{t.cta.title}</h2>
            <p>{t.cta.text}</p>
            <a className="btn btn--wa btn--lg" href={waLink(t.wa.hello)} target="_blank" rel="noopener">
              <Icon name="whatsapp" size={22} />
              {t.cta.btn}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
