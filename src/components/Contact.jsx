import { useState } from 'react'
import { brand, mapEmbed, tel, waLink } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'
import OpenStatus from './OpenStatus.jsx'

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  const [map, setMap] = useState(false)
  const route = `https://www.google.com/maps/dir/?api=1&destination=${brand.geo.lat},${brand.geo.lng}`

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead id="contact-title" eyebrow={c.eyebrow} title={c.title} />
        <div className="contact">
          <address className="card glass contact__card" data-glow data-reveal>
            <div className="contact__row">
              <span className="contact__icon"><Icon name="pin" /></span>
              <div>
                <p className="contact__label">{c.address}</p>
                <p className="contact__value">
                  {brand.street}
                  <br />
                  {brand.postalCode} {brand.city}
                </p>
              </div>
            </div>
            <div className="contact__row">
              <span className="contact__icon"><Icon name="phone" /></span>
              <div>
                <p className="contact__label">{c.phone}</p>
                <p className="contact__value contact__phone">
                  <a href={tel}>{brand.phone}</a>
                </p>
              </div>
            </div>
            <div className="contact__row">
              <span className="contact__icon"><Icon name="clock" /></span>
              <div>
                <p className="contact__label">
                  {c.hoursTitle} <OpenStatus />
                </p>
                <dl className="hours">
                  {c.hours.map(([d, h]) => (
                    <div key={d}>
                      <dt>{d}</dt>
                      <dd>{h}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="contact__actions">
              <a className="btn btn--wa" href={waLink(t.wa.hello)} target="_blank" rel="noopener">
                <Icon name="whatsapp" size={20} /> WhatsApp
              </a>
              <a className="btn btn--glass" href={route} target="_blank" rel="noopener">
                <Icon name="route" size={20} /> {c.route}
              </a>
            </div>

            <div className="contact__social">
              <p className="contact__label">{c.social}</p>
              <div className="social-icons">
                <a href={brand.social.instagram} target="_blank" rel="noopener" aria-label="Instagram @nvsmotorss">
                  <Icon name="instagram" />
                </a>
                <a href={brand.social.tiktok} target="_blank" rel="noopener" aria-label="TikTok @nvs_motors_auto_naprawa">
                  <Icon name="tiktok" />
                </a>
                <a href={brand.maps} target="_blank" rel="noopener" aria-label="Google Maps">
                  <Icon name="google" />
                </a>
              </div>
            </div>
          </address>

          <div className="map glass" data-reveal>
            {map ? (
              <iframe title={c.mapTitle} src={mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <div className="map__placeholder">
                <div className="map__pin" aria-hidden="true">
                  <Icon name="pin" size={40} />
                </div>
                <p className="map__addr">
                  {brand.street}, {brand.city}
                </p>
                <button type="button" className="btn btn--gold" onClick={() => setMap(true)}>
                  <Icon name="map" size={20} /> {c.mapBtn}
                </button>
                <p className="map__note">{c.mapNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
