import { services } from '../config.js'
import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'

export default function Services() {
  const { t, book } = useLang()
  const s = t.services
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead id="services-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ul className="services">
          {services.map((id, i) => {
            const item = s.items[id]
            return (
              <li key={id} className="card glass service" data-glow data-reveal style={{ '--d': `${(i % 4) * 70}ms` }}>
                <span className="service__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="service__icon">
                  <Icon name={id} size={30} />
                </span>
                <h3 className="service__name">{item.name}</h3>
                <p className="service__text">{item.text}</p>
                <ul className="chips">
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <button type="button" className="service__ask" onClick={() => book(id)}>
                  {s.ask}
                  <Icon name="arrow" size={18} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
