import { brand, gallery, img } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'

export default function Gallery() {
  const { t, openGallery } = useLang()
  const g = t.gallery
  return (
    <section className="section" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="gallery__head">
          <SectionHead id="gallery-title" eyebrow={g.eyebrow} title={g.title} lead={g.lead} />
          <div className="social-btns" data-reveal>
            <span className="social-btns__label">{g.follow}</span>
            <a className="btn btn--glass btn--small" href={brand.social.instagram} target="_blank" rel="noopener">
              <Icon name="instagram" size={18} /> Instagram
            </a>
            <a className="btn btn--glass btn--small" href={brand.social.tiktok} target="_blank" rel="noopener">
              <Icon name="tiktok" size={18} /> TikTok
            </a>
          </div>
        </div>
        <ul className="gallery">
          {gallery.map((p, i) => (
            <li key={p.id} className="gallery__item" data-reveal style={{ '--d': `${(i % 4) * 60}ms` }}>
              <button type="button" className="gallery__btn" data-glow onClick={() => openGallery(i)} aria-label={`${g.open}: ${g.alts[p.id]}`}>
                <img src={img(`work/${p.id}`)} alt={g.alts[p.id]} width="480" height="640" loading="lazy" decoding="async" />
                <span className="gallery__zoom" aria-hidden="true">
                  <Icon name="zoom" size={22} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
