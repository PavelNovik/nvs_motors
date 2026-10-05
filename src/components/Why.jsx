import { useLang } from '../i18n/index.jsx'
import Icon from './Icon.jsx'
import SectionHead from './SectionHead.jsx'

const icons = ['clock', 'money', 'medal', 'pin']
const valueIcons = ['bolt', 'shieldCheck', 'handshake', 'thumb']

export default function Why() {
  const { t } = useLang()
  const w = t.why
  return (
    <section className="section why" id="why" aria-labelledby="why-title">
      <div className="container">
        <SectionHead id="why-title" eyebrow={w.eyebrow} title={w.title} center />
        <ol className="why__grid">
          {w.items.map((item, i) => (
            <li key={item.title} className="card glass why__item" data-glow data-reveal style={{ '--d': `${i * 80}ms` }}>
              <span className="why__num" aria-hidden="true">{i + 1}</span>
              <span className="why__icon">
                <Icon name={icons[i]} size={28} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="values glass" data-reveal>
          <ul>
            {w.values.map((v, i) => (
              <li key={v}>
                <Icon name={valueIcons[i]} size={22} />
                {v}
              </li>
            ))}
          </ul>
          <p className="values__owner">
            <span className="stars" aria-hidden="true">★★★★★</span> {w.owner}
          </p>
        </div>
      </div>
    </section>
  )
}
